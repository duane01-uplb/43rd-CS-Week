import { and, asc, eq, gte, ne } from 'drizzle-orm';
import { events } from '@csweek/db';
import { getDb } from '$lib/server/db';
import type { PageServerLoad } from './$types';

async function loadEvents(status: 'open' | null, upcoming: boolean) {
	const filters = [status ? eq(events.status, status) : ne(events.status, 'draft')];
	if (upcoming) filters.push(gte(events.startAt, new Date()));
	return getDb().select().from(events).where(and(...filters)).orderBy(asc(events.startAt)).execute();
}

export const load: PageServerLoad = async ({ url }) => {
	const status = url.searchParams.get('status') === 'all' ? null : 'open';
	const upcoming = url.searchParams.get('upcoming') === '1';
	const results = loadEvents(status, upcoming);
	const fullRender = url.searchParams.get('render') === 'full';
	if (!fullRender) void results.catch(() => {});
	return {
		events: fullRender ? await results : results,
		status: status ?? 'all',
		upcoming
	};
};
