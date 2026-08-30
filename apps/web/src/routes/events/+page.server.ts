import { and, asc, eq, gte, type SQL } from 'drizzle-orm';
import { events } from '@csweek/db';
import { cacheKeys } from '@csweek/cache';
import { cache } from '$lib/server/cache';
import { getDb } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const status = url.searchParams.get('status') === 'all' ? null : 'open';
	const upcoming = url.searchParams.get('upcoming') === '1';
	return cache.getJson(cacheKeys.webEvents(status, upcoming), 30, async () => {
		const filters: SQL[] = [];
		if (status) filters.push(eq(events.status, status));
		if (upcoming) filters.push(gte(events.startAt, new Date()));
		return {
			events: await getDb()
				.select()
				.from(events)
				.where(filters.length ? and(...filters) : undefined)
				.orderBy(asc(events.startAt)),
			status: status ?? 'all',
			upcoming
		};
	});
};