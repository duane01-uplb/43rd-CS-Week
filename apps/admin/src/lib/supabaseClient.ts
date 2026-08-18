import { createBrowserClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';

const url = env.PUBLIC_SUPABASE_URL;
const anonKey = env.PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Environment variables may be unset during local editing — warn but allow the file to exist.
  // Install and configure env vars before running the app.
  console.warn('Supabase public env vars are not set: PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createBrowserClient(url ?? '', anonKey ?? '');
