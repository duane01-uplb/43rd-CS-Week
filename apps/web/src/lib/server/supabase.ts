import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

// Server-only client for anonymous registration file uploads. The public
// web app has no user sessions, so uploads are written with the service-role
// key rather than an end-user session. Never expose SUPABASE_SERVICE_ROLE_KEY
// to the client.
export function createServiceRoleClient() {
  return createClient(env.PUBLIC_SUPABASE_URL ?? '', env.SUPABASE_SERVICE_ROLE_KEY ?? '', {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}