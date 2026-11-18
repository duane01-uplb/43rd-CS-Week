import { asc } from 'drizzle-orm';
import { events } from '@csweek/db';
import { getDb } from '$lib/server/db';
import { requireAdmin } from '$lib/server/auth-guards';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);
	return { events: await getDb().select().from(events).orderBy(asc(events.startAt)) };
};
