import { fail, redirect } from '@sveltejs/kit';
import { events } from '@csweek/db';
import { cacheKeys } from '@csweek/cache';
import { cache } from '$lib/server/cache';
import { getDb } from '$lib/server/db';
import { requireAdmin } from '$lib/server/auth-guards';
import { readEventForm } from '$lib/server/event-form';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async (event) => {
    await requireAdmin(event);
    const form = await event.request.formData().catch(() => null);
    if (!form) return fail(400, { error: 'Could not read the event form.' });
    const input = readEventForm(form);
    if (!input.values) return fail(400, { error: input.error });

    const [created] = await getDb().insert(events).values(input.values).returning({ id: events.id });
    await cache.bust(cacheKeys.adminOverview);
    throw redirect(303, `/admin/events/${created.id}/edit`);
  }
};
