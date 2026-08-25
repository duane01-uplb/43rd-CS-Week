import { asc, eq, ilike, or } from 'drizzle-orm';
import { eventRegistrationFields, events, profiles, registrations } from '@csweek/db';
import { getDb } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const q = url.searchParams.get('q')?.trim();
	const status = url.searchParams.get('status');
	const db = getDb();
	const rows = await db
		.select({
			id: registrations.id,
			eventId: registrations.eventId,
			status: registrations.status,
			createdAt: registrations.createdAt,
			responses: registrations.responses,
			event: events.title,
			name: profiles.fullName
		})
		.from(registrations)
		.innerJoin(events, eq(registrations.eventId, events.id))
		.innerJoin(profiles, eq(registrations.userId, profiles.id))
		.where(q ? or(ilike(events.title, `%${q}%`), ilike(profiles.fullName, `%${q}%`)) : status ? eq(registrations.status, status) : undefined)
		.orderBy(asc(registrations.createdAt));
	const fields = await db
		.select({
			eventId: eventRegistrationFields.eventId,
			fieldKey: eventRegistrationFields.fieldKey,
			label: eventRegistrationFields.label,
			fieldType: eventRegistrationFields.fieldType,
			sortOrder: eventRegistrationFields.sortOrder
		})
		.from(eventRegistrationFields)
		.orderBy(eventRegistrationFields.sortOrder);
	return { rows, fields, q: q ?? '', status: status ?? '' };
};
