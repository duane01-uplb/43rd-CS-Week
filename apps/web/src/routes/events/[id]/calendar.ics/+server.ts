import { and, eq, ne } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { events } from '@csweek/db';
import { getDb } from '$lib/server/db';
import type { RequestHandler } from './$types';

function timestamp(date: Date) {
	return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function escapeText(text: string) {
	return text.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/[,;]/g, '\\$&');
}

// Calendar lines wrap at 75 UTF-8 octets, including the continuation space.
function foldLine(line: string) {
	const encoder = new TextEncoder();
	let result = '';
	let length = 0;
	for (const character of line) {
		const size = encoder.encode(character).length;
		if (length + size > 75) {
			result += '\r\n ';
			length = 1;
		}
		result += character;
		length += size;
	}
	return result;
}

export const GET: RequestHandler = async ({ params, url }) => {
	if (!/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(params.id)) error(404, 'Event not found');
	const [event] = await getDb()
		.select({ title: events.title, start: events.startAt, end: events.endAt })
		.from(events)
		.where(and(eq(events.id, params.id), ne(events.status, 'draft')));
	if (!event) error(404, 'Event not found');

	const lines = [
		'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//UPLB Computer Science Society//CS Week//EN',
		'BEGIN:VEVENT',
		`UID:${params.id}@${url.hostname}`,
		`DTSTAMP:${timestamp(new Date())}`,
		`DTSTART:${timestamp(event.start)}`
	];
	if (event.end && event.end > event.start) lines.push(`DTEND:${timestamp(event.end)}`);
	lines.push(
		`SUMMARY:${escapeText(event.title)}`,
		`URL:${new URL(`/events/${params.id}`, url).href}`,
		'END:VEVENT', 'END:VCALENDAR'
	);
	return new Response(lines.map(foldLine).join('\r\n') + '\r\n', {
		headers: {
			'Content-Type': 'text/calendar; charset=utf-8',
			'Content-Disposition': `attachment; filename="csweek-${params.id}.ics"`
		}
	});
};
