import { asc, eq, ilike, or } from 'drizzle-orm';
import { events, profiles, registrations } from '@csweek/db';
import { getDb } from '$lib/server/db';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ url }) => { const q = url.searchParams.get('q')?.trim(); const status = url.searchParams.get('status'); const rows = await getDb().select({ id: registrations.id, status: registrations.status, createdAt: registrations.createdAt, event: events.title, name: profiles.fullName }).from(registrations).innerJoin(events, eq(registrations.eventId, events.id)).innerJoin(profiles, eq(registrations.userId, profiles.id)).where(q ? or(ilike(events.title, `%${q}%`), ilike(profiles.fullName, `%${q}%`)) : status ? eq(registrations.status, status) : undefined).orderBy(asc(registrations.createdAt)); return { rows, q: q ?? '', status: status ?? '' }; };
