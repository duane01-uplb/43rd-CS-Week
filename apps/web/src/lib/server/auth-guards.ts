import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { getDb } from './db';
import { profiles } from '@csweek/db';
import type { RequestEvent } from '@sveltejs/kit';

export function requireSession(event: RequestEvent) {
  const session = event.locals.session;
  if (!session) throw redirect(303, '/login');
  return session;
}

export async function requireAdmin(event: RequestEvent) {
  const session = requireSession(event);
  const db = getDb();
  const rows = await db.select().from(profiles).where(eq(profiles.id, session.user.id)).limit(1);
  const profile = rows[0];
  if (profile?.role !== 'admin') throw error(403, 'Forbidden');
  return { session, profile };
}
