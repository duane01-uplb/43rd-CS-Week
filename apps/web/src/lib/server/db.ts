import { createDb } from '@csweek/db';
import { DATABASE_URL } from '$env/static/private';

let _db: ReturnType<typeof createDb> | null = null;

export function getDb() {
	if (_db) return _db;
	if (!DATABASE_URL) {
		throw new Error('DATABASE_URL is not set. Set it in environment for server-side DB access.');
	}
	_db = createDb(DATABASE_URL);
	return _db;
}
