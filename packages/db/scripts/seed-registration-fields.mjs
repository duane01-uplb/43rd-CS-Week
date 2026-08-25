// Seed registration fields for the three events that need registration:
//   Career Orientation, Warframes (organizer form label "Web Design"), Games Day.
//
// Usage (anywhere):  bun packages/db/scripts/seed-registration-fields.mjs
//
// Idempotent: safe to re-run.
//   - Events are matched case-insensitively by title; created only if missing.
//     NOTE: seeded event descriptions/dates are placeholders — organizers can
//     adjust them via the admin dashboard without affecting this script
//     (matching is by title).
//   - Registration fields upsert on (event_id, field_key): existing rows get
//     their label/options/required/sort_order refreshed, ids preserved.
//
// Scope notes:
//   - Conditional-field logic deliberately NOT implemented (see DECISIONS.md
//     2026-08-25): SHS/college fields (Career Orientation) and Team Members
//     2–3 (Warframes) are seeded is_required=false even though they are
//     conditionally required in practice.
//   - proof_of_payment is a manual-payment evidence upload (bank/GCash QR
//     screenshot) — NOT payment processing; payments remain descoped.

import postgres from 'postgres';
import { readFileSync } from 'node:fs';

// Minimal .env loader (repo-root .env holds DATABASE_URL / DIRECT_URL).
for (const line of readFileSync(new URL('../../../.env', import.meta.url), 'utf8').split(/\r?\n/)) {
	const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
	if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
}

const CONSENT_LABEL =
	'We value and protect your personal information by virtue of and in compliance with the Data Privacy Act of 2012 (RA 10173). The information you will be sharing shall be stored in a database accessible to the admin members of the Web Design Committee of UPLB COSS only.';
const CONSENT_OPTIONS = [
	'Yes, I agree and understand',
	'No, I do not agree and need further clarification'
];

const EVENTS = [
	{
		title: 'Career Orientation',
		candidates: ['career orientation'],
		description:
			'Career Orientation talks to help you plan your path — open to junior high school, senior high school, and college students.',
		startAt: '2027-02-19T13:00:00+08:00',
		endAt: '2027-02-19T15:00:00+08:00',
		fields: [
			['data_privacy_consent', CONSENT_LABEL, 'select', CONSENT_OPTIONS, true],
			['email', 'Email Address', 'email', null, true],
			['full_name', 'Full Name (Last Name, First Name, Suffix, MI)', 'text', null, true],
			[
				'student_year_level',
				'Student Year Level',
				'select',
				['Junior High School', 'Senior High School', 'College', 'I am not a student'],
				true
			],
			['current_school', 'Current School (full name; "N/A" if not applicable)', 'text', null, true],
			[
				'shs_track',
				'Track',
				'select',
				['Academic', 'Technical-Vocational-Livelihood (TVL)', 'Sports', 'Arts and Design'],
				false // conditionally required (SHS) — see DECISIONS.md 2026-08-25
			],
			['shs_strand', 'Strand', 'select', ['STEM', 'ABM', 'HUMSS', 'GAS', 'ICT'], false],
			['college_degree_program', 'Degree Program (full name)', 'text', null, false],
			[
				'college_student_classification',
				'Student Classification',
				'select',
				['Freshman', 'Sophomore', 'Junior', 'Senior'],
				false
			],
			['college_student_number', 'Student Number ("N/A" if not applicable)', 'text', null, false],
			[
				'event_attendance',
				'When will you attend?',
				'select',
				['February 19 (Thursday, 1–3 PM only)', 'February 20', 'I will attend both days'],
				true
			]
		]
	},
	{
		title: 'Warframes',
		candidates: ['warframes', 'web design'],
		description:
			'Warframes team tournament (registration form labeled "Web Design"). Teams of 1–3; registration fee paid manually via bank/GCash — upload your QR/transaction screenshot as proof of payment.',
		startAt: '2027-02-20T09:00:00+08:00',
		endAt: '2027-02-20T17:00:00+08:00',
		fields: [
			['data_privacy_consent', CONSENT_LABEL, 'select', CONSENT_OPTIONS, true],
			['representative_name', 'Representative Name', 'text', null, true],
			['representative_email', 'Email of Representative', 'email', null, true],
			['contact_number', 'Contact Number', 'text', null, true],
			['team_name', 'Team Name', 'text', null, true],
			['school_affiliation', 'School Affiliation/Institution', 'text', null, true],
			['number_of_members', 'Number of members', 'select', ['1', '2', '3'], true],
			['member_1_name_discord', 'Team Member 1 (Surname, Firstname, MI | Discord Username)', 'text', null, true],
			[
				'member_2_name_discord',
				'Team Member 2 (Surname, Firstname, MI | Discord Username)',
				'text',
				null,
				false // conditionally required (members ≥ 2) — see DECISIONS.md 2026-08-25
			],
			['member_3_name_discord', 'Team Member 3 (Surname, Firstname, MI | Discord Username)', 'text', null, false],
			['registration_type', 'Registration type', 'select', ['Regular - 190 pesos'], true],
			['proof_of_payment', 'Proof of Payment (QR scan image)', 'file', null, true],
			['referral_name', 'Name of referral (optional)', 'text', null, false]
		]
	},
	{
		title: 'Games Day',
		candidates: ['games day'],
		description:
			'Games Day 5v5 team tournament. Teams of 5 plus one optional reserve player. Register your whole team with one submission.',
		startAt: '2027-02-20T09:00:00+08:00',
		endAt: '2027-02-20T17:00:00+08:00',
		fields: [
			['data_privacy_consent', CONSENT_LABEL, 'select', CONSENT_OPTIONS, true],
			['email', 'Email', 'email', null, true],
			['contact_number', 'Contact Number', 'text', null, true],
			['team_name', 'Team Name', 'text', null, true],
			['team_description', 'Short Team Description', 'text', null, true],
			['captain_full_name', 'Full Name of Team Captain', 'text', null, true],
			['captain_in_game_id', 'Team Captain In-Game ID', 'text', null, true],
			['member_2_name_id', 'Full Name + In-Game ID (2nd player)', 'text', null, true],
			['member_3_name_id', 'Full Name + In-Game ID (3rd player)', 'text', null, true],
			['member_4_name_id', 'Full Name + In-Game ID (4th player)', 'text', null, true],
			['member_5_name_id', 'Full Name + In-Game ID (5th player)', 'text', null, true],
			['reserve_player_name_id', 'Full Name + In-Game ID (Reserve Player)', 'text', null, false]
		]
	}
];

const sql = postgres(process.env.DIRECT_URL ?? process.env.DATABASE_URL);

let insertedFields = 0;
let updatedFields = 0;

for (const def of EVENTS) {
	const existing = await sql`
		select id from events where lower(title) in ${sql(def.candidates.map((c) => c.toLowerCase()))}
	`;
	let eventId;
	if (existing.length === 1) {
		eventId = existing[0].id;
		console.log(`= event exists: ${def.title} (${eventId})`);
	} else if (existing.length === 0) {
		const [row] = await sql`
			insert into events (title, description, start_at, end_at, capacity, status)
			values (${def.title}, ${def.description}, ${def.startAt}, ${def.endAt}, null, 'open')
			returning id
		`;
		eventId = row.id;
		console.log(`+ event created: ${def.title} (${eventId}) [placeholder schedule — adjust via admin]`);
	} else {
		throw new Error(`Ambiguous match for "${def.title}" — ${existing.length} events found. Fix titles first.`);
	}

	for (let i = 0; i < def.fields.length; i++) {
		const [fieldKey, label, fieldType, options, isRequired] = def.fields[i];
		const result = await sql`
			insert into event_registration_fields (event_id, field_key, label, field_type, options, is_required, sort_order)
			values (${eventId}, ${fieldKey}, ${label}, ${fieldType}, ${options ? JSON.stringify(options) : null}, ${isRequired}, ${i})
			on conflict (event_id, field_key) do update
			set label = excluded.label,
			    field_type = excluded.field_type,
			    options = excluded.options,
			    is_required = excluded.is_required,
			    sort_order = excluded.sort_order
			returning (xmax = 0) as inserted
		`;
		if (result[0]?.inserted) insertedFields++;
		else updatedFields++;
	}
}

const summary = await sql`
	select e.title, count(f.id) as field_count
	from events e left join event_registration_fields f on f.event_id = e.id
	where lower(e.title) in ${sql(EVENTS.flatMap((d) => d.candidates.map((c) => c.toLowerCase())))}
	group by e.title order by e.title
`;
console.log('---');
console.log(`fields inserted: ${insertedFields}, refreshed: ${updatedFields}`);
console.table(summary);
await sql.end();
