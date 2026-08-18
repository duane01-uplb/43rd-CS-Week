import { fail, redirect } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/server/supabase';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');
    const fullName = String(data.get('fullName') ?? '').trim();
    if (!email || password.length < 8 || !fullName) return fail(400, { error: 'Enter your name, email, and a password of at least 8 characters.', email, fullName });
    const { error } = await createSupabaseServerClient(event).auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    if (error) return fail(400, { error: error.message, email, fullName });
    throw redirect(303, '/login?checkEmail=1');
  }
};
