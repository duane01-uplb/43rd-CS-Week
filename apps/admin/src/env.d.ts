/// <reference types="@sveltejs/kit" />

// Provide minimal ambient module declarations for SvelteKit virtual env modules
declare module '$env/static/public';
declare module '$env/static/private';
declare module '$env/dynamic/public';
declare module '$env/dynamic/private';

export {};
import type { User } from '@supabase/supabase-js';

declare global {
  namespace App {
    interface Locals { user: User | null; }
  }
}

export {};
