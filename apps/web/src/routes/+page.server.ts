import { and, asc, eq, gte } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { events } from '@csweek/db';
import { cacheKeys } from '@csweek/cache';
import { cache } from '$lib/server/cache';
import { getDb } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () =>
	cache.getJson(cacheKeys.webHome, 30, async () => {
		const db = getDb();
		const openWhere = eq(events.status, 'open');
		const upcomingWhere = and(eq(events.status, 'open'), gte(events.startAt, new Date()));
		// Full open roster drives the schedule calendar (past-dated events the
		// organizers scheduled must still appear on it).
		const roster = await db
			.select()
			.from(events)
			.where(openWhere)
			.orderBy(asc(events.startAt));
		const upcomingRows = await db
			.select()
			.from(events)
			.where(upcomingWhere)
			.orderBy(asc(events.startAt))
			.limit(3);
		const upcoming = upcomingRows.length > 0 ? upcomingRows : roster.slice(0, 3);
		const [{ value: dbOpenCount }] = await db
			.select({ value: count() })
			.from(events)
			.where(upcomingWhere);
		const openCount = Number(dbOpenCount) > 0 ? Number(dbOpenCount) : roster.length;
		return { roster, upcoming, openCount };
	});