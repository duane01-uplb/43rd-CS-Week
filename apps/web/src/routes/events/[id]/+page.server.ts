import { and, count, eq } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import { eventRegistrationFields, events, registrations } from '@csweek/db';
import { getDb } from '$lib/server/db';
import { requireSession } from '$lib/server/auth-guards';
import type { Actions, PageServerLoad } from './$types';

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
    const responses: Record<string, FormDataEntryValue | boolean> = {};
    for (const field of fields) {
      const value = field.fieldType === 'checkbox' ? form.has(field.fieldKey) : form.get(field.fieldKey);
      if (field.isRequired && (value === null || value === '' || value === false)) return fail(400, { error: `${field.label} is required.` });
      if (value !== null) responses[field.fieldKey] = value;
    }
    const existing = await db.select({ id: registrations.id }).from(registrations).where(and(eq(registrations.eventId, target.id), eq(registrations.userId, user.id))).limit(1);
    if (existing.length) return fail(409, { error: 'You are already registered for this event.' });
    if (target.capacity !== null) {
      const [{ total }] = await db.select({ total: count() }).from(registrations).where(and(eq(registrations.eventId, target.id), eq(registrations.status, 'confirmed')));
      if (total >= target.capacity) return fail(409, { error: 'This event is at capacity.' });
    }
    try { await db.insert(registrations).values({ eventId: target.id, userId: user.id, status: 'confirmed', responses }); }
    catch { return fail(409, { error: 'We could not complete your registration. It may already exist.' }); }
    return { success: true };
  }
};
