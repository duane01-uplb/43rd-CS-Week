import { and, count, eq } from 'drizzle-orm';
import { events, registrations } from '@csweek/db';
import { cacheKeys } from '@csweek/cache';
import { cache } from '$lib/server/cache';
import { getDb } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () =>
	cache.getJson(cacheKeys.adminOverview, 15, async () => {
		const db = getDb();

		const [eventRow] = await db.select({ total: count() }).from(events);
		const [openRow] = await db.select({ total: count() }).from(events).where(eq(events.status, 'open'));
		const [regRow] = await db.select({ total: count() }).from(registrations);
		const [pendingRow] = await db
			.select({ total: count() })
			.from(registrations)
			.where(eq(registrations.status, 'pending'));
		const [confirmedRow] = await db
			.select({ total: count() })
			.from(registrations)
			.where(eq(registrations.status, 'confirmed'));

		return {
			eventCount: eventRow.total,
			openEventCount: openRow.total,
			registrationCount: regRow.total,
			pendingCount: pendingRow.total,
			confirmedCount: confirmedRow.total
		};
	});