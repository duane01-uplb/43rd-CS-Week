# Architecture

## Stack
- Framework: **Svelte / SvelteKit** (corrected — see note below)
- Backend/DB: Supabase (Postgres, Auth, Storage)
- Cache/Rate-limit: **Upstash Redis** (serverless REST — see "Caching & Rate Limiting" below)
- Hosting: Vercel
 - Package Manager: Bun (use `bun install`, `bun add`, `bun run`, and `bunx`; do NOT use `npm`/`npx`)

> **Correction note:** This document originally specified Next.js (App Router). The project was scaffolded with Next.js first (`next-scaffold/`), but the frontend was rebuilt on Svelte/SvelteKit. `next-scaffold/` is abandoned — see `DECISIONS.md`. Svelte/SvelteKit is the current and only frontend framework in use.

## Environments
- Local (dev)
- Staging (Vercel preview / staging project)
- Production

## Folder Structure (actual — reflects live repo)
```
/apps
  /admin                     # Admin-facing SvelteKit application
    /src
      /lib
        /components          # Admin shell & UI components (AdminShellHeader.svelte, AppSidebar.svelte)
        /server              # Server-side utilities (db.ts, supabase.ts, auth-guards.ts)
        supabaseClient.ts    # Browser-side Supabase client instance
      /routes
        /admin               # Protected admin dashboard layout & views
          /events            # Event list, creation (/new), and editing (/[id]/edit)
          /registrations     # Registration table with search and filters
        /login               # Admin login
  /web                       # Public-facing SvelteKit application (homepage, events, registration — no accounts)
    /src
      /lib
        /server              # Server-side utilities (db.ts, supabase.ts)
      /routes
        /events              # Event browsing (+page) and registration details (/[id])
        +page.svelte         # Landing homepage

/packages
  /db                        # Shared Drizzle schema + connection factory, imported by both apps/web and apps/admin
  /cache                     # Shared Upstash Redis cache helper (read-through cache, rate limiter, cache-key registry), imported by both apps

/supabase                    # Migrations and seed data
```

### Conventions
- Global/shell components sit in `components/` (e.g. `AdminShellHeader.svelte`, `AppSidebar.svelte`).
- Server-only modules (database connection, server-side Supabase client, auth guard assertions) live in `$lib/server/` to ensure they are never bundled into client-side code.
- `routes/` follows standard SvelteKit conventions (`+page.svelte`, `+page.server.ts`, `+layout.svelte`, `+server.ts`, etc.).

### Verified Items & Setup Locations
- [x] Multi-app workspace structure: `apps/web` (public participant site) and `apps/admin` (event & registration management).
- [x] Supabase client and auth setup locations:
  - Admin browser client: `apps/admin/src/lib/supabaseClient.ts` (using `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`).
  - Admin server client & auth guards: `$lib/server/supabase.ts`, `$lib/server/auth-guards.ts`, and `hooks.server.ts` in `apps/admin`.
  - Web server client: `apps/web/src/lib/server/supabase.ts` (service-role only, for registration file uploads — the public site has no accounts).
  - Server DB connection: `$lib/server/db.ts` in both apps (connecting via `@csweek/db` using `DATABASE_URL`).
  - Server cache client: `$lib/server/cache.ts` in both apps (connecting via `@csweek/cache` using `UPSTASH_REDIS_REST_URL`/`TOKEN`).

## Payments
Not implemented. All registrations are free (see DECISIONS.md).

## Data Access
- ORM: Drizzle (drizzle-orm + drizzle-kit), connecting directly to the
  Supabase Postgres pooler connection (DATABASE_URL, service-level — not
  the public anon key).
- Supabase is still used for Auth (admin login only) and Storage.
  Supabase's JS client (`@supabase/supabase-js`) is retained ONLY for
  `supabase.auth.*` calls (admin app) and server-side registration uploads
  (web app, via the service-role key) — all data reads/writes go through
  Drizzle.
- Schema defined in `schema.ts` (TypeScript), migrations generated via
  `drizzle-kit generate` / applied via `drizzle-kit push`.
- IMPORTANT: Drizzle connects directly to Postgres and BYPASSES Row Level
  Security. RLS policies remain in place as defense-in-depth only.
  Authorization is enforced in application code — see `AUTHORIZATION.md`.

## Caching & Rate Limiting (Upstash Redis)
- Both apps wrap the same Upstash Redis instance via `@csweek/cache`
  (`packages/cache/`), created from `UPSTASH_REDIS_REST_URL` +
  `UPSTASH_REDIS_REST_TOKEN` in each app's `lib/server/cache.ts`.
- **Read-through TTL cache:** homepage (`web:home`), `/events` listings
  (`web:events:*`), event detail (`web:event:{id}`) — TTL 30s; admin overview
  counts (`admin:overview`) — TTL 15s. Only public/display reads are cached;
  the capacity check inside the registration action still hits Postgres so it
  never oversells.
- **Cache invalidation (best-effort):** successful anonymous registration
  busts `admin:overview`; admin event create/edit busts `admin:overview`,
  `web:home`, all `web:events:*` variants, and `web:event:{id}`.
- **Rate limiting:** the anonymous registration action enforces fixed-window
  counters before any DB work — 10 attempts per event per IP per 15 min
  (`rl:register:event:{eventId}:{ip}`) and 50 per IP per hour
  (`rl:register:global:{ip}`), returning HTTP 429.
- **Fails open:** if Redis env is missing or Upstash is unreachable, loads
  hit the DB directly and rate limits allow through (logged). An infra outage
  must never block registration or page loads.

## Deployment
- Push to `main` → Vercel prod
- Push to feature branch → Vercel preview (staging validation)
