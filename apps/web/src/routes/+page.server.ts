import { and, asc, eq, gte } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { events } from '@csweek/db';
import { getDb } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const db = getDb();
	const openWhere = and(eq(events.status, 'open'), gte(events.startAt, new Date()));
	const upcoming = await db
		.select()
		.from(events)
		.where(openWhere)
		.orderBy(asc(events.startAt))
		.limit(3);
	const [{ value: openCount }] = await db
		.select({ value: count() })
		.from(events)
		.where(openWhere);
	return { upcoming, openCount };
};