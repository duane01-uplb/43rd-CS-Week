Admin Svelte app (skeleton)

This folder contains a minimal skeleton for the admin SvelteKit application.

Supabase client
- `src/lib/supabaseClient.ts` — exports `supabase` created via `@supabase/supabase-js`.

Quick setup
1. From the repo root, install dependencies for your Svelte app (run in the app when present):

```bash
# from repo root or apps/admin when you have a package.json
npm install @supabase/supabase-js
```

2. Set environment variables (see `.env.example`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Notes
- This is a lightweight skeleton. Replace with your actual SvelteKit routing, server endpoints, and build scripts as appropriate.
