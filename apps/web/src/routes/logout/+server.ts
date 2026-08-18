import { redirect } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/server/supabase';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
  await createSupabaseServerClient(event).auth.signOut();
  throw redirect(303, '/');
};
