import { and, asc, eq, gte, ne } from 'drizzle-orm';
import { events } from '@csweek/db';
import { getDb } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const status = url.searchParams.get('status') === 'all' ? null : 'open';
	const upcoming = url.searchParams.get('upcoming') === '1';
	const filters = [status ? eq(events.status, status) : ne(events.status, 'draft')];
	if (upcoming) filters.push(gte(events.startAt, new Date()));
	return {
		events: await getDb().select().from(events).where(and(...filters)).orderBy(asc(events.startAt)),
		status: status ?? 'all',
		upcoming
	};
};
