import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postgres from 'postgres';

function loadDatabaseUrl() {
	const envPath = resolve(process.cwd(), '.env');
	const text = readFileSync(envPath, 'utf8');
	for (const line of text.split(/\r?\n/)) {
		if (line.startsWith('DATABASE_URL=')) {
			return line.slice('DATABASE_URL='.length).trim().replace(/^["']|["']$/g, '');
		}
	}
	throw new Error('DATABASE_URL not found in .env');
}

const url = loadDatabaseUrl();
const sql = postgres(url, { prepare: false, max: 1, ssl: 'require' });

try {
	const rows = await sql`
		select indexname, indexdef
		from pg_indexes
		where schemaname = 'public'
			and indexname in ('events_status_start_at_idx', 'registrations_status_created_at_idx')
		order by indexname
	`;
	console.log(JSON.stringify(rows, null, 2));
	console.log('COUNT=' + rows.length);
	process.exitCode = rows.length === 2 ? 0 : 3;
} catch (e) {
	console.error('QUERY_FAILED', e instanceof Error ? e.message : e);
	process.exitCode = 2;
} finally {
	await sql.end({ timeout: 5 });
}
