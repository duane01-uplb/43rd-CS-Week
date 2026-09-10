export interface EventMeta {
	modality: 'F2F' | 'Online';
	dateLabel: string;
	timeLabel?: string;
	venue: string;
	note?: string;
	tba?: boolean;
	activeDays: string[]; // Keys in 'YYYY-MM-DD'
}

export const EVENT_METADATA: Record<string, EventMeta> = {
	'job fair': {
		modality: 'F2F',
		dateLabel: 'Feb 2, 2026 – Feb 4, 2026',
		timeLabel: '9:00 AM – 5:00 PM PST',
		venue: 'Face-to-Face (F2F)',
		note: '3-day Fair',
		activeDays: ['2026-02-02', '2026-02-03', '2026-02-04']
	},
	'career orientation': {
		modality: 'F2F',
		dateLabel: 'Feb 2, 2026 – Feb 3, 2026',
		timeLabel: '1:00 PM – 3:00 PM PST',
		venue: 'Face-to-Face (F2F)',
		note: '2-day Series',
		activeDays: ['2026-02-02', '2026-02-03']
	},
	'jeopardy': {
		modality: 'F2F',
		dateLabel: 'TBA',
		timeLabel: 'To be announced',
		venue: 'Face-to-Face (F2F)',
		note: 'Date TBA',
		tba: true,
		activeDays: []
	},
	'code wars': {
		modality: 'F2F',
		dateLabel: 'Feb 6, 2026',
		timeLabel: '9:00 AM – 5:00 PM PST',
		venue: 'Face-to-Face (F2F)',
		note: 'Full-day Contest',
		activeDays: ['2026-02-06']
	},
	'warframes': {
		modality: 'Online',
		dateLabel: 'Feb 1, 2026 – Feb 7, 2026',
		timeLabel: 'Online submission & judging',
		venue: 'Online',
		note: 'Feb 1–7 · Online',
		activeDays: ['2026-02-02', '2026-02-03', '2026-02-04', '2026-02-05', '2026-02-06', '2026-02-07']
	},
	'games day': {
		modality: 'Online',
		dateLabel: '4 weeks long · Feb 7, 2026 finals',
		timeLabel: 'Finals Livestream',
		venue: 'Online (Livestreamed)',
		note: 'Finals · Livestreamed',
		activeDays: ['2026-02-07']
	}
};

export interface CalendarDayDef {
	key: string;
	slug: string;
	dayNum: number;
	month: string;
	monthYear: string;
}

// CS Week goes explicitly from Feb 2 to Feb 7, 2026 (Mon - Sat)
export const CS_WEEK_CALENDAR_DAYS: CalendarDayDef[] = [
	{ key: '2026-02-02', slug: 'MON', dayNum: 2, month: 'Feb', monthYear: 'FEBRUARY 2026' },
	{ key: '2026-02-03', slug: 'TUE', dayNum: 3, month: 'Feb', monthYear: 'FEBRUARY 2026' },
	{ key: '2026-02-04', slug: 'WED', dayNum: 4, month: 'Feb', monthYear: 'FEBRUARY 2026' },
	{ key: '2026-02-05', slug: 'THU', dayNum: 5, month: 'Feb', monthYear: 'FEBRUARY 2026' },
	{ key: '2026-02-06', slug: 'FRI', dayNum: 6, month: 'Feb', monthYear: 'FEBRUARY 2026' },
	{ key: '2026-02-07', slug: 'SAT', dayNum: 7, month: 'Feb', monthYear: 'FEBRUARY 2026' }
];

export function getEventMeta(title: string): EventMeta {
	const key = (title || '').toLowerCase().trim();
	for (const [k, v] of Object.entries(EVENT_METADATA)) {
		if (key.includes(k) || k.includes(key)) {
			return v;
		}
	}
	return {
		modality: 'F2F',
		dateLabel: 'Feb 2026',
		venue: 'CS Week Venue',
		activeDays: []
	};
}
