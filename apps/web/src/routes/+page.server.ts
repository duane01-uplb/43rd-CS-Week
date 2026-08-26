import { and, asc, eq, gte } from 'drizzle-orm';
import { events } from '@csweek/db';
import { getDb } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const db = getDb();
	const upcoming = await db
		.select()
		.from(events)
		.where(and(eq(events.status, 'open'), gte(events.startAt, new Date())))
		.orderBy(asc(events.startAt))
		.limit(3);
	return { upcoming };
};
