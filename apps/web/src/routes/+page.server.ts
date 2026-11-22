import { and, asc, eq, gte, inArray, ne, sql } from 'drizzle-orm';
import { program } from '$lib/program';
import { events } from '@csweek/db';
import { getDb } from '$lib/server/db';
import type { PageServerLoad } from './$types';

async function loadEventSummary() {
	const db = getDb();
	const openWhere = and(eq(events.status, 'open'), gte(events.startAt, new Date()));
	const [upcoming, programEvents] = await Promise.all([
		db.select().from(events).where(openWhere).orderBy(asc(events.startAt)).limit(3),
		db.select({ id: events.id, title: events.title }).from(events)
			.where(and(
				ne(events.status, 'draft'),
				inArray(sql`lower(trim(${events.title}))`, program.flatMap((area) => area.aliases))
			))
			.orderBy(asc(events.startAt))
	]);
	return { upcoming, programEvents };
}

export const load: PageServerLoad = async ({ url }) => {
	const summary = loadEventSummary();
	if (url.searchParams.get('render') === 'full') {
		return { summary: await summary.catch(() => null) };
	}
	// A failed query can reject before SvelteKit attaches the stream handler.
	void summary.catch(() => {});
	return { summary };
};
