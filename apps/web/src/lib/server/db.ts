import { createDb } from '@csweek/db';
import { env } from '$env/dynamic/private';

let _db: ReturnType<typeof createDb> | null = null;

export function getDb() {
	if (_db) return _db;
	if (!env.DATABASE_URL) {
		throw new Error('DATABASE_URL is not set. Set it in environment for server-side DB access.');
	}
	_db = createDb(env.DATABASE_URL);
	return _db;
}
