import { and, count, eq } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import { eventRegistrationFields, events, registrations } from '@csweek/db';
import { getDb } from '$lib/server/db';
import { requireSession } from '$lib/server/auth-guards';
import { createSupabaseServerClient } from '$lib/server/supabase';
import type { Actions, PageServerLoad } from './$types';

const UPLOAD_BUCKET = 'registration-uploads';
// 4 MB — must stay under Vercel serverless' ~4.5 MB request-body cap.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

function sanitizeFileName(name: string) {
	const cleaned = name.replace(/[^\w.-]+/g, '_').replace(/^_+|_+$/g, '');
	return cleaned.slice(-80) || 'upload';
}

export const load: PageServerLoad = async ({ params }) => {
  const db = getDb();
  const event = await db.query.events.findFirst({ where: eq(events.id, params.id) });
  if (!event) throw error(404, 'Event not found');
  return { event, fields: await db.select().from(eventRegistrationFields).where(eq(eventRegistrationFields.eventId, event.id)).orderBy(eventRegistrationFields.sortOrder) };
};

export const actions: Actions = {
  register: async (event) => {
    const user = requireSession(event);
    const db = getDb();
    const target = await db.query.events.findFirst({ where: eq(events.id, event.params.id) });
    if (!target || target.status !== 'open') return fail(400, { error: 'This event is not open for registration.' });
    const fields = await db.select().from(eventRegistrationFields).where(eq(eventRegistrationFields.eventId, target.id));
    const form = await event.request.formData();
    const responses: Record<string, string | boolean> = {};
    const pendingUploads: { fieldKey: string; file: File }[] = [];
    // Pass 1: validate all answers first — uploads happen only after the
    // duplicate/capacity checks below, so failed registrations do not
    // leave orphaned files in storage.
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
    const existing = await db.select({ id: registrations.id }).from(registrations).where(and(eq(registrations.eventId, target.id), eq(registrations.userId, user.id))).limit(1);
    if (existing.length) return fail(409, { error: 'You are already registered for this event.' });
    if (target.capacity !== null) {
      const [{ total }] = await db.select({ total: count() }).from(registrations).where(and(eq(registrations.eventId, target.id), eq(registrations.status, 'confirmed')));
      if (total >= target.capacity) return fail(409, { error: 'This event is at capacity.' });
    }
    // Pass 2: push uploads to Supabase Storage using the registrant's own
    // session (the "users insert own uploads" policy pins writes to their
    // auth.uid() folder). Only the resulting storage path is stored in
    // responses — never the raw file.
    if (pendingUploads.length) {
      const supabase = createSupabaseServerClient(event);
      for (const { fieldKey, file } of pendingUploads) {
        const path = `${user.id}/${target.id}/${Date.now()}-${sanitizeFileName(file.name)}`;
        const { error: uploadError } = await supabase.storage.from(UPLOAD_BUCKET).upload(path, file, { contentType: file.type || 'application/octet-stream' });
        if (uploadError) {
          console.error(`Storage upload failed for ${path}:`, uploadError.message);
          return fail(500, { error: 'We could not upload your file. Please try again.' });
        }
        responses[fieldKey] = path;
      }
    }
    try { await db.insert(registrations).values({ eventId: target.id, userId: user.id, status: 'confirmed', responses }); }
    catch { return fail(409, { error: 'We could not complete your registration. It may already exist.' }); }
    return { success: true };
  }
};
