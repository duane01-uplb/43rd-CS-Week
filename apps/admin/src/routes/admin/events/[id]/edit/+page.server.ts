import { count, eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import { events, registrations } from '@csweek/db';
import { getDb } from '$lib/server/db';
import { requireAdmin } from '$lib/server/auth-guards';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  await requireAdmin(event);
  const db = getDb();
  const target = await db.query.events.findFirst({ where: eq(events.id, event.params.id) });
  if (!target) throw error(404, 'Event not found');
  const [{ total: registrationCount }] = await db
    .select({ total: count() })
    .from(registrations)
    .where(eq(registrations.eventId, target.id));
  return { event: target, registrationCount };
};

export const actions: Actions = {
  default: async (event) => {
    await requireAdmin(event);
    const db = getDb();
    const target = await db.query.events.findFirst({ where: eq(events.id, event.params.id) });
    if (!target) throw error(404, 'Event not found');

    const form = await event.request.formData();
    const title = String(form.get('title') ?? '').trim();
    const startAt = new Date(String(form.get('startAt') ?? ''));
    const capacityValue = String(form.get('capacity') ?? '');
    const capacity = capacityValue ? Number(capacityValue) : null;
    const status = String(form.get('status') ?? 'draft');

    if (!title || Number.isNaN(startAt.getTime())) {
      return fail(400, { error: 'Title and start time are required.' });
    }

    if (capacity !== null) {
      const [{ total: registrationCount }] = await db
        .select({ total: count() })
        .from(registrations)
        .where(eq(registrations.eventId, target.id));
      if (capacity < registrationCount) {
        return fail(400, {
          error: `Capacity (${capacity}) is below the current registration count (${registrationCount}). Increase capacity or leave it unset before saving.`
        });
      }
    }

    await db
      .update(events)
      .set({
        title,
        description: String(form.get('description') ?? '').trim() || null,
        startAt,
        capacity,
        status
      })
      .where(eq(events.id, target.id));

    throw redirect(303, '/admin/events');
  }
};
