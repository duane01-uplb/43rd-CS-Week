import { count, eq } from 'drizzle-orm';
import { events, registrations } from '@csweek/db';
import { getDb } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const db = getDb();
  const [{ total: eventCount }] = await db.select({ total: count() }).from(events);
  const [{ total: registrationCount }] = await db.select({ total: count() }).from(registrations).where(eq(registrations.status, 'confirmed'));
  return { eventCount, registrationCount };
};
