Public SvelteKit app (skeleton)

This folder contains a minimal SvelteKit skeleton for the public-facing site.

Setup
1. From the repo root, install dependencies (Bun workspaces must be installed at root):

```bash
bun install
```

1. Set environment variables (see repo root `.env` or Vercel settings):

- `PUBLIC_SUPABASE_URL` — Supabase Storage (server-side uploads)
- `SUPABASE_SERVICE_ROLE_KEY` — server-only key for registration file
  uploads (never exposed to the client)
- `DATABASE_URL` — Postgres pooler connection string, used by Drizzle for all data queries (server-side only, never exposed to the client)
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — Upstash Redis for
  read-through caching (homepage/events/detail, TTL 30s) and registration
  rate limiting. Optional at runtime: if unset, loads hit the DB directly and
  rate limits allow through.

The public site has no accounts: no sign-in/sign-up routes, no session
cookies, and no browser-side Supabase client.

Run
```bash
bun run dev
```
Schema changes go through Drizzle, not the Supabase dashboard — see
`.agents/skills/drizzle-migrations/SKILL.md`.

Notes
- This is a minimal scaffold. Replace with full SvelteKit routing, adapters, and hooks as needed.
