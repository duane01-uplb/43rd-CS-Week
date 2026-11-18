import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import { countConfirmedRegistrations, events } from '@csweek/db';
import { cacheKeys } from '@csweek/cache';
import { cache } from '$lib/server/cache';
import { getDb } from '$lib/server/db';
import { requireAdmin } from '$lib/server/auth-guards';
import { formatEventStart, readEventForm } from '$lib/server/event-form';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  await requireAdmin(event);
  const db = getDb();
  const target = await db.query.events.findFirst({ where: eq(events.id, event.params.id) });
  if (!target) throw error(404, 'Event not found');
  const registrationCount = await countConfirmedRegistrations(db, target.id);
  return { event: target, registrationCount, startAtInput: formatEventStart(target.startAt) };
};

export const actions: Actions = {
  default: async (event) => {
    await requireAdmin(event);
    const form = await event.request.formData().catch(() => null);
    if (!form) return fail(400, { error: 'Could not read the event form.' });
    const input = readEventForm(form);
    if (!input.values) return fail(400, { error: input.error });
    const values = input.values;
    const { capacity } = values;

    const eventId = event.params.id;
    const failure = await getDb().transaction(async (tx) => {
      // Signups take the same lock before checking status and reserving a seat.
      const [target] = await tx.select({ startAt: events.startAt }).from(events).where(eq(events.id, eventId)).for('update');
      if (!target) throw error(404, 'Event not found');

      if (capacity !== null) {
        const registrationCount = await countConfirmedRegistrations(tx, eventId);
        if (capacity < registrationCount) {
          return fail(400, {
            error: `Capacity (${capacity}) is below the confirmed registration count (${registrationCount}). Increase capacity or leave it unset before saving.`
          });
        }
      }

      await tx.update(events).set({
        ...values,
        startAt: formatEventStart(target.startAt) === formatEventStart(values.startAt) ? target.startAt : values.startAt
      }).where(eq(events.id, eventId));
    }, { isolationLevel: 'read committed' });
    if (failure) return failure;

    await cache.bust(cacheKeys.adminOverview);

    throw redirect(303, '/admin/events');
  }
};
