Public SvelteKit app (skeleton)

This folder contains a minimal SvelteKit skeleton for the public-facing site.

Setup
1. From `apps/web`, install dependencies:

```bash
npm install
```

1. Set environment variables (see repo root `.env` or CI settings):

- `PUBLIC_SUPABASE_URL` — Supabase Auth only
- `PUBLIC_SUPABASE_ANON_KEY` — Supabase Auth only
- `DATABASE_URL` — Postgres pooler connection string, used by Drizzle for all data queries (server-side only, never exposed to the client)

Run
```bash
npm run dev
```
Schema changes go through Drizzle, not the Supabase dashboard — see
`.agents/skills/drizzle-migrations/SKILL.md`.

Notes
- This is a minimal scaffold. Replace with full SvelteKit routing, adapters, and hooks as needed.
