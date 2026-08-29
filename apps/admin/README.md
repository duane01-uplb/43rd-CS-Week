Admin Svelte app (skeleton)

This folder contains a minimal skeleton for the admin SvelteKit application.

Supabase client
- `src/lib/supabaseClient.ts` — exports `supabase` created via `@supabase/supabase-js`. Used for Auth (sign-up/login/session) only.
- Data queries (events, registrations, profiles) go through Drizzle, not this client — see `.agents/skills/drizzle-migrations/SKILL.md` and `agents/ARCHITECTURE.md`.

Quick setup
1. From the repo root, install dependencies for your Svelte app (run in the app when present):

```bash
# from repo root
bun add @supabase/supabase-js drizzle-orm postgres
bun add -d drizzle-kit
```

1. Set environment variables (see repo root `.env` or your secret manager):
- `PUBLIC_SUPABASE_URL` — Supabase Auth only
- `PUBLIC_SUPABASE_ANON_KEY` — Supabase Auth only
- `DATABASE_URL` — Postgres pooler connection string, used by Drizzle (server-side only)
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — Upstash Redis for
  overview-count caching (TTL 15s) and cache busting after event edits.
  Optional at runtime: if unset, the overview loads straight from Postgres.

Notes
- This is a lightweight skeleton. Replace with your actual SvelteKit routing, server endpoints, and build scripts as appropriate.
