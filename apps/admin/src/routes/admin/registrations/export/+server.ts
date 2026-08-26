import { asc, eq, ilike, or } from 'drizzle-orm';
import { eventRegistrationFields, events, profiles, registrations } from '@csweek/db';
import { getDb } from '$lib/server/db';
import { requireAdmin } from '$lib/server/auth-guards';
import type { RequestHandler } from './$types';

function escapeCSV(value: unknown): string {
	if (value === null || value === undefined) return '';
	const str = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
	if (str.includes(',') || str.includes('"') || str.includes('\n')) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}

export const GET: RequestHandler = async (event) => {
	await requireAdmin(event);

	const q = event.url.searchParams.get('q')?.trim();
	const status = event.url.searchParams.get('status');
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
		.where(
			q
				? or(ilike(events.title, `%${q}%`), ilike(profiles.fullName, `%${q}%`))
				: status
					? eq(registrations.status, status)
					: undefined
		)
		.orderBy(asc(registrations.createdAt));

	const fields = await db
		.select({
			eventId: eventRegistrationFields.eventId,
			fieldKey: eventRegistrationFields.fieldKey,
			label: eventRegistrationFields.label,
			sortOrder: eventRegistrationFields.sortOrder
		})
		.from(eventRegistrationFields)
		.orderBy(eventRegistrationFields.sortOrder);

	const dynamicKeys = [...new Set(fields.map((f) => f.fieldKey))];

	const headers = ['Participant', 'Event', 'Status', 'Registered', ...dynamicKeys];

	const csvRows = rows.map((row) => {
		const responses = (row.responses ?? {}) as Record<string, unknown>;
		const dynamicCols = dynamicKeys.map((key) => responses[key]);
		return [
			escapeCSV(row.name ?? 'Unnamed'),
			escapeCSV(row.event),
			escapeCSV(row.status),
			escapeCSV(new Date(row.createdAt).toLocaleString()),
			...dynamicCols.map(escapeCSV)
		];
	});

	const csv = [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n');

	return new Response(csv, {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': 'attachment; filename="registrations.csv"'
		}
	});
};
