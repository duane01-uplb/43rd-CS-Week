import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

const url = PUBLIC_SUPABASE_URL;
const anonKey = PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Environment variables may be unset during local editing — warn but allow the file to exist.
  // Install and configure env vars before running the app.
  console.warn('Supabase public env vars are not set: PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(url, anonKey);
