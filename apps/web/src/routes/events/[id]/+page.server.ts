import { and, eq, ne } from 'drizzle-orm';
import { error, fail, isRedirect, redirect } from '@sveltejs/kit';
import { ANONYMOUS_USER_ID, countConfirmedRegistrations, eventRegistrationFields, events, registrations } from '@csweek/db';
import { cacheKeys } from '@csweek/cache';
import { cache } from '$lib/server/cache';
import { getDb } from '$lib/server/db';
import { createServiceRoleClient } from '$lib/server/supabase';
import { getExternalRegistration } from '$lib/externalRegistration';
import type { Actions, PageServerLoad } from './$types';

const UPLOAD_BUCKET = 'registration-uploads';
// 4 MB — must stay under Vercel serverless' ~4.5 MB request-body cap.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
type UploadStorage = ReturnType<ReturnType<typeof createServiceRoleClient>['storage']['from']>;

// Fixed-window rate limits for the anonymous registration action. The public
// site has no sessions, so per-IP counters are the abuse guard for the one
// write path that touches the service-role key. Checked before any DB work.
const RATE_LIMIT = {
	// 10 attempts per event, per IP, per 15 minutes.
	perEventPerIp: { limit: 10, windowSeconds: 15 * 60 },
	// 50 attempts per IP across all events, per hour.
	globalPerIp: { limit: 50, windowSeconds: 60 * 60 }
};

function sanitizeFileName(name: string) {
	const cleaned = name.replace(/[^\w.-]+/g, '_').replace(/^_+|_+$/g, '');
	return cleaned.slice(-80) || 'upload';
}

async function removeRegistrationUploads(storage: UploadStorage, paths: string[]) {
  if (!paths.length) return;
  try {
    const { error } = await storage.remove(paths);
    if (error) throw error;
  } catch (cleanupError) {
    console.error('Could not remove unreferenced registration uploads:', paths, cleanupError);
  }
}

export const load: PageServerLoad = async ({ params }) => {
	const rows = await getDb()
		.select({ event: events, field: eventRegistrationFields })
		.from(events)
		.leftJoin(eventRegistrationFields, eq(eventRegistrationFields.eventId, events.id))
		.where(and(eq(events.id, params.id), ne(events.status, 'draft')))
		.orderBy(eventRegistrationFields.sortOrder);
	const event = rows[0]?.event;
	if (!event) throw error(404, 'Event not found');
	return { event, fields: rows.flatMap(({ field }) => (field ? [field] : [])) };
};

export const actions: Actions = {
  register: async (event) => {
    const ip = event.getClientAddress();
    const eventId = event.params.id;
    const [perEvent, global] = await Promise.all([
      cache.rateLimit(cacheKeys.rlRegisterEvent(eventId, ip), RATE_LIMIT.perEventPerIp.limit, RATE_LIMIT.perEventPerIp.windowSeconds),
      cache.rateLimit(cacheKeys.rlRegisterGlobal(ip), RATE_LIMIT.globalPerIp.limit, RATE_LIMIT.globalPerIp.windowSeconds)
    ]);
    if (!perEvent.ok || !global.ok) return fail(429, { error: 'Too many registration attempts from this device. Please wait a few minutes and try again.' });

    const db = getDb();
    const target = await db.query.events.findFirst({ where: eq(events.id, eventId) });
    if (!target || target.status !== 'open') return fail(400, { error: 'This event is not open for registration.' });
    const external = getExternalRegistration(target.title);
    if (external) throw redirect(303, external.url);
    const fields = await db.select().from(eventRegistrationFields).where(eq(eventRegistrationFields.eventId, target.id));
    const form = await event.request.formData();
    const responses: Record<string, string | boolean> = {};
    const pendingUploads: { fieldKey: string; file: File }[] = [];
    // Validate answers and check capacity before starting any uploads.
    for (const field of fields) {
      if (field.fieldType === 'file') {
        const upload = form.get(field.fieldKey);
        const hasFile = upload instanceof File && upload.size > 0;
        if (field.isRequired && !hasFile) return fail(400, { error: `${field.label} is required.` });
        if (!hasFile) continue;
        const file = upload as File;
        if (!file.type.startsWith('image/')) return fail(400, { error: `${field.label} must be an image (PNG, JPG, WebP, or HEIC).` });
        if (file.size > MAX_UPLOAD_BYTES) return fail(400, { error: `${field.label} must be 4 MB or smaller.` });
        pendingUploads.push({ fieldKey: field.fieldKey, file });
        continue;
      }
      const value = field.fieldType === 'checkbox' ? form.has(field.fieldKey) : form.get(field.fieldKey);
      if (field.isRequired && (value === null || value === '' || value === false)) return fail(400, { error: `${field.label} is required.` });
      if (value !== null && !(value instanceof File)) responses[field.fieldKey] = value;
    }
    if (target.capacity !== null && await countConfirmedRegistrations(db, eventId) >= target.capacity) {
      return fail(409, { error: 'This event is at capacity.' });
    }

    const registrationId = crypto.randomUUID();
    const uploadPaths: string[] = [];
    let storage: UploadStorage | undefined;
    try {
      if (pendingUploads.length) {
        storage = createServiceRoleClient().storage.from(UPLOAD_BUCKET);
        for (const { fieldKey, file } of pendingUploads) {
          const path = `${ANONYMOUS_USER_ID}/${eventId}/${Date.now()}-${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;
          // Include attempted paths in case Storage wrote the object before a transport error.
          uploadPaths.push(path);
          const { error: uploadError } = await storage.upload(path, file, { contentType: file.type });
          if (uploadError) throw uploadError;
          responses[fieldKey] = path;
        }
      }
    } catch (uploadError) {
      console.error('Registration upload failed:', uploadError);
      if (storage) await removeRegistrationUploads(storage, uploadPaths);
      return fail(500, { error: 'We could not upload your file. Please try again.' });
    }

    let inserted = false;
    try {
      const rejection = await db.transaction(async (tx) => {
        // Read status and capacity after acquiring the lock shared with admin edits.
        const [current] = await tx.select().from(events).where(eq(events.id, eventId)).for('update');
        if (!current || current.status !== 'open') {
          return { failure: fail(400, { error: 'This event is not open for registration.' }) };
        }
        const external = getExternalRegistration(current.title);
        if (external) return { redirectUrl: external.url };
        if (current.capacity !== null && await countConfirmedRegistrations(tx, eventId) >= current.capacity) {
          return { failure: fail(409, { error: 'This event is at capacity.' }) };
        }

        await tx.insert(registrations).values({
          id: registrationId,
          eventId,
          userId: ANONYMOUS_USER_ID,
          status: 'confirmed',
          responses
        });
        inserted = true;
      }, { isolationLevel: 'read committed' });

      if (rejection) {
        if (storage) await removeRegistrationUploads(storage, uploadPaths);
        if (rejection.failure) return rejection.failure;
        throw redirect(303, rejection.redirectUrl);
      }
    } catch (registrationError) {
      if (isRedirect(registrationError)) throw registrationError;
      // Postgres error details may contain submitted answers.
      const errorCode = registrationError instanceof Error && 'code' in registrationError
        ? registrationError.code
        : undefined;
      console.error('Registration transaction failed:', registrationId, errorCode);
      let committed = false;
      try {
        // A lost COMMIT response can leave a registration that still needs its files.
        if (inserted) {
          committed = await db.transaction(async (tx) => {
            // Wait for the original transaction to release the event before reading its outcome.
            await tx.select({ id: events.id }).from(events).where(eq(events.id, eventId)).for('update');
            const registration = await tx.query.registrations.findFirst({
              columns: { id: true },
              where: eq(registrations.id, registrationId)
            });
            return Boolean(registration);
          }, { isolationLevel: 'read committed' });
        }
      } catch (verificationError) {
        console.error('Could not verify registration outcome:', registrationId, verificationError);
        return fail(500, { error: 'We could not verify whether your registration completed. Please contact the organizers.' });
      }
      if (!committed) {
        if (storage) await removeRegistrationUploads(storage, uploadPaths);
        return fail(500, { error: 'We could not complete your registration. Please try again.' });
      }
    }
    // A confirmed registration changes dashboard counts immediately.
    await cache.bust(cacheKeys.adminOverview);
    return { success: true };
  }
};
