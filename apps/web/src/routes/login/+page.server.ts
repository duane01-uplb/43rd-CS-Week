import { fail, redirect } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/server/supabase';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');
    if (!email || !password) return fail(400, { error: 'Email and password are required.', email });
    const { error } = await createSupabaseServerClient(event).auth.signInWithPassword({ email, password });
    if (error) return fail(400, { error: error.message, email });
    throw redirect(303, '/events');
  }
};
