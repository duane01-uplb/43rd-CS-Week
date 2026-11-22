import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postgres from 'postgres';

const YEAR = Number(process.argv[2] ?? 2027);
if (!Number.isInteger(YEAR) || YEAR < 2020 || YEAR > 2100) {
	throw new Error('Usage: bun packages/db/scripts/set-event-year.mjs [year]');
}

function loadEnv() {
	const envPath = resolve(process.cwd(), '.env');
	const text = readFileSync(envPath, 'utf8');
	for (const line of text.split(/\r?\n/)) {
		const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
		if (!m || process.env[m[1]] !== undefined) continue;
		let v = m[2].trim();
		if (
			v.length >= 2 &&
			((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
		) {
			v = v.slice(1, -1);
		}
		process.env[m[1]] = v;
	}
}

loadEnv();
const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL not found');

const sql = postgres(url, { prepare: false, max: 1, ssl: 'require' });

try {
	const before = await sql`
		select title,
			extract(year from timezone('Asia/Manila', start_at))::int as start_year,
			start_at,
			end_at
		from events
		order by start_at, title
	`;
	console.log('before');
	console.table(
		before.map((r) => ({
			title: r.title,
			start_year: r.start_year,
			start_at: r.start_at.toISOString(),
			end_at: r.end_at.toISOString()
		}))
	);

	const updated = await sql`
		update events
		set
			start_at = start_at + make_interval(
				years => ${YEAR} - extract(year from timezone('Asia/Manila', start_at))::int
			),
			end_at = end_at + make_interval(
				years => ${YEAR} - extract(year from timezone('Asia/Manila', end_at))::int
			),
			description = replace(coalesce(description, ''), '2026', ${String(YEAR)})
		returning title, start_at, end_at
	`;
	console.log(`updated ${updated.length} events to ${YEAR}`);
	console.table(
		updated.map((r) => ({
			title: r.title,
			start_at: r.start_at.toISOString(),
			end_at: r.end_at.toISOString()
		}))
	);

	try {
		const { createCacheFromEnv, cacheKeys } = await import('../../cache/src/index.ts');
		const cache = createCacheFromEnv(process.env);
		const eventIds = await sql`select id from events`;
		await cache.bust(
			cacheKeys.webHome,
			cacheKeys.adminOverview,
			...cacheKeys.webEventsVariants,
			...eventIds.map((row) => cacheKeys.webEvent(row.id))
		);
		console.log(cache.enabled ? 'cache busted' : 'cache not configured; skipped bust');
	} catch (e) {
		console.warn('cache bust skipped:', e instanceof Error ? e.message : e);
	}
} finally {
	await sql.end({ timeout: 5 });
}
