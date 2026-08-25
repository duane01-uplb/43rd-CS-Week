import { error, redirect } from '@sveltejs/kit';
import { requireAdmin } from '$lib/server/auth-guards';
import { createSupabaseServerClient } from '$lib/server/supabase';
import type { RequestHandler } from './$types';

const UPLOAD_BUCKET = 'registration-uploads';
// Uploads are always stored as "{auth.uid()}/{event_id}/{timestamp}-{name}".
// Require the owner-UUID prefix so admins can only sign paths inside the bucket.
const PATH_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\//i;

export const GET: RequestHandler = async (event) => {
	await requireAdmin(event);
	const path = event.url.searchParams.get('path') ?? '';
	if (!PATH_PATTERN.test(path)) throw error(400, 'Invalid file path');
	// Signed URL is minted with the signed-in admin's own credentials —
	// allowed by the "admins read uploads" storage policy.
	const supabase = createSupabaseServerClient(event);
	const { data, error: signError } = await supabase.storage.from(UPLOAD_BUCKET).createSignedUrl(path, 300);
	if (signError || !data) throw error(404, 'File not found or no longer available');
	throw redirect(302, data.signedUrl);
};
