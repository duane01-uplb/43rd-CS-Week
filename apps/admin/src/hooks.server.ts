import type { Handle } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/server/supabase';

export const handle: Handle = async ({ event, resolve }) => {
	const hasSessionCookie = event.cookies.getAll().some(
		(c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
	);
	if (hasSessionCookie) {
		const supabase = createSupabaseServerClient(event);
		const { data: { user } } = await supabase.auth.getUser();
		event.locals.user = user;
	} else {
		event.locals.user = null;
	}
	return resolve(event);
};
