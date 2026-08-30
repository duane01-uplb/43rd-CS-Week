import { fail, redirect } from '@sveltejs/kit';
import { events } from '@csweek/db';
import { cacheKeys } from '@csweek/cache';
import { cache } from '$lib/server/cache';
import { getDb } from '$lib/server/db';
import { requireAdmin } from '$lib/server/auth-guards';
import type { Actions } from './$types';
export const actions: Actions = { default: async (event) => { await requireAdmin(event); const form = await event.request.formData(); const title = String(form.get('title') ?? '').trim(); const startAt = new Date(String(form.get('startAt') ?? '')); const capacityValue = String(form.get('capacity') ?? ''); if (!title || Number.isNaN(startAt.getTime())) return fail(400, { error: 'Title and start time are required.' }); const [created] = await getDb().insert(events).values({ title, description: String(form.get('description') ?? '').trim() || null, startAt, capacity: capacityValue ? Number(capacityValue) : null, status: String(form.get('status') ?? 'draft') }).returning({ id: events.id }); await cache.bust(cacheKeys.adminOverview, cacheKeys.webHome, ...cacheKeys.webEventsVariants); throw redirect(303, `/admin/events/${created.id}/edit`); } };
