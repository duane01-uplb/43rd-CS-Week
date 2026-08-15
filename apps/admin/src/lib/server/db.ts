import { createDb } from '@csweek/db';
import { DATABASE_URL } from '$env/static/private';

export const db = createDb(DATABASE_URL);
