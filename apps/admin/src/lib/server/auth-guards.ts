import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { profiles } from '@csweek/db';
import type { RequestEvent } from '@sveltejs/kit';

export function requireSession(event: RequestEvent) {
  const session = event.locals.session;
  if (!session) throw redirect(303, '/login');
  return session;
}

export async function requireAdmin(event: RequestEvent) {
  const session = requireSession(event);
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, session.user.id),
  });
  if (profile?.role !== 'admin') throw error(403, 'Forbidden');
  return { session, profile };
}
