import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import { countConfirmedRegistrations, events } from '@csweek/db';
import { cacheKeys } from '@csweek/cache';
import { cache } from '$lib/server/cache';
import { getDb } from '$lib/server/db';
import { requireAdmin } from '$lib/server/auth-guards';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  await requireAdmin(event);
  const db = getDb();
  const target = await db.query.events.findFirst({ where: eq(events.id, event.params.id) });
  if (!target) throw error(404, 'Event not found');
  const registrationCount = await countConfirmedRegistrations(db, target.id);
  return { event: target, registrationCount };
};

export const actions: Actions = {
  default: async (event) => {
    await requireAdmin(event);
    const form = await event.request.formData();
    const title = String(form.get('title') ?? '').trim();
    const startAt = new Date(String(form.get('startAt') ?? ''));
    const capacityValue = String(form.get('capacity') ?? '');
    const capacity = capacityValue ? Number(capacityValue) : null;
    const status = String(form.get('status') ?? 'draft');

    if (!title || Number.isNaN(startAt.getTime())) {
      return fail(400, { error: 'Title and start time are required.' });
    }

    const eventId = event.params.id;
    const failure = await getDb().transaction(async (tx) => {
      // Signups take the same lock before checking status and reserving a seat.
      const [target] = await tx.select({ id: events.id }).from(events).where(eq(events.id, eventId)).for('update');
      if (!target) throw error(404, 'Event not found');

      if (capacity !== null) {
        const registrationCount = await countConfirmedRegistrations(tx, eventId);
        if (capacity < registrationCount) {
          return fail(400, {
            error: `Capacity (${capacity}) is below the confirmed registration count (${registrationCount}). Increase capacity or leave it unset before saving.`
          });
        }
      }

      await tx
        .update(events)
        .set({
          title,
          description: String(form.get('description') ?? '').trim() || null,
          startAt,
          capacity,
          status
        })
        .where(eq(events.id, eventId));
    }, { isolationLevel: 'read committed' });
    if (failure) return failure;

    await cache.bust(cacheKeys.adminOverview);

    throw redirect(303, '/admin/events');
  }
};
