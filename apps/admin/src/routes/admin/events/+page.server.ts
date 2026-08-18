import { asc } from 'drizzle-orm';
import { events } from '@csweek/db';
import { getDb } from '$lib/server/db';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async () => ({ events: await getDb().select().from(events).orderBy(asc(events.startAt)) });
