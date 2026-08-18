import type { Handle } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/server/supabase';

export const handle: Handle = async ({ event, resolve }) => {
  const supabase = createSupabaseServerClient(event);
  const { data: { user } } = await supabase.auth.getUser();
  event.locals.user = user;
  return resolve(event);
};
