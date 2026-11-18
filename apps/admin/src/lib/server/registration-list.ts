import { and, asc, eq, ilike, or, sql } from 'drizzle-orm';
import { ANONYMOUS_USER_ID, eventRegistrationFields, events, profiles, registrations } from '@csweek/db';
import { getDb } from './db';

const primaryNameFields = ['full_name', 'representative_name', 'captain_full_name'];
const participantNameFields = [
	...primaryNameFields,
	'member_1_name_discord',
	'member_2_name_discord',
	'member_3_name_discord',
	'member_2_name_id',
	'member_3_name_id',
	'member_4_name_id',
	'member_5_name_id',
	'reserve_player_name_id'
];

export async function listRegistrations(url: URL) {
	const q = url.searchParams.get('q')?.trim() ?? '';
	const status = url.searchParams.get('status') ?? '';
	// Escape LIKE metacharacters so names and event titles can be searched literally.
	const pattern = `%${q.replace(/[\\%_]/g, '\\$&')}%`;
	const db = getDb();
	const rows = await db
		.select({
			id: registrations.id,
			eventId: registrations.eventId,
			userId: registrations.userId,
			status: registrations.status,
			createdAt: registrations.createdAt,
			responses: registrations.responses,
			event: events.title,
			name: profiles.fullName
		})
		.from(registrations)
		.innerJoin(events, eq(registrations.eventId, events.id))
		.innerJoin(profiles, eq(registrations.userId, profiles.id))
		.where(and(
			status ? eq(registrations.status, status) : undefined,
			q ? or(
				ilike(events.title, pattern),
				ilike(profiles.fullName, pattern),
				...participantNameFields.map((key) =>
					ilike(sql`${registrations.responses} ->> ${key}::text`, pattern)
				)
			) : undefined
		))
		.orderBy(asc(registrations.createdAt), asc(registrations.id));

	const fields = await db
		.select({
			eventId: eventRegistrationFields.eventId,
			fieldKey: eventRegistrationFields.fieldKey,
			label: eventRegistrationFields.label,
			fieldType: eventRegistrationFields.fieldType,
			sortOrder: eventRegistrationFields.sortOrder
		})
		.from(eventRegistrationFields)
		.orderBy(eventRegistrationFields.sortOrder, eventRegistrationFields.fieldKey, eventRegistrationFields.eventId);

	return {
		rows: rows.map(({ userId, ...row }) => {
			if (userId !== ANONYMOUS_USER_ID) return row;
			const responses = row.responses as Record<string, unknown> | null;
			for (const key of primaryNameFields) {
				const name = responses?.[key];
				if (typeof name === 'string' && name.trim()) return { ...row, name: name.trim() };
			}
			return row;
		}),
		fields,
		q,
		status
	};
}
