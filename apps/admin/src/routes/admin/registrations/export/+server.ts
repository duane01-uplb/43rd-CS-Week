import { requireAdmin } from '$lib/server/auth-guards';
import { listRegistrations } from '$lib/server/registration-list';
import type { RequestHandler } from './$types';

function escapeCSV(value: unknown): string {
	if (value === null || value === undefined) return '';
	const text = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
	// Treat formula-like text as literal even if the trigger follows whitespace.
	const formulaLike = /^[\t\r\n]|^\s*[=+@＝＋－＠-]/u.test(text);
	const cell = formulaLike ? `'${text}` : text;
	return formulaLike || /[,"\r\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;
}

export const GET: RequestHandler = async (event) => {
	await requireAdmin(event);
	const { rows, fields } = await listRegistrations(event.url);
	const dynamicKeys = [...new Set(fields.map((field) => field.fieldKey))];
	const headers = ['Participant', 'Event', 'Status', 'Registered', ...dynamicKeys];

	const csvRows = rows.map((row) => {
		const responses = (row.responses ?? {}) as Record<string, unknown>;
		const dynamicColumns = dynamicKeys.map((key) =>
			Object.prototype.hasOwnProperty.call(responses, key) ? responses[key] : undefined
		);
		return [
			row.name ?? 'Unnamed',
			row.event,
			row.status,
			new Date(row.createdAt).toLocaleString(),
			...dynamicColumns
		].map(escapeCSV).join(',');
	});

	const csv = [headers.map(escapeCSV).join(','), ...csvRows].join('\r\n');
	return new Response(csv, {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': 'attachment; filename="registrations.csv"'
		}
	});
};
