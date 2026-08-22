# Architecture

## Stack
- Framework: **Svelte / SvelteKit** (corrected — see note below)
- Backend/DB: Supabase (Postgres, Auth, Storage)
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
  /web                       # Public-facing SvelteKit application (homepage, events, registration, auth)
    /src
      /lib
        /server              # Server-side utilities (db.ts, supabase.ts, auth-guards.ts)
        supabaseClient.ts    # Browser-side Supabase client instance
      /routes
        /events              # Event browsing (+page) and registration details (/[id])
        /login               # Participant login (+page)
        /signup              # Participant signup (+page)
        /logout              # Session teardown endpoint (+server.ts)
        +page.svelte         # Landing homepage

/packages
  /db                        # Shared Drizzle schema + connection factory, imported by both apps/web and apps/admin

/supabase                    # Migrations and seed data
```

### Conventions
- Global/shell components sit in `components/` (e.g. `AdminShellHeader.svelte`, `AppSidebar.svelte`).
- Server-only modules (database connection, server-side Supabase client, auth guard assertions) live in `$lib/server/` to ensure they are never bundled into client-side code.
- `routes/` follows standard SvelteKit conventions (`+page.svelte`, `+page.server.ts`, `+layout.svelte`, `+server.ts`, etc.).

### Verified Items & Setup Locations
- [x] Multi-app workspace structure: `apps/web` (public participant site) and `apps/admin` (event & registration management).
- [x] Supabase client and auth setup locations:
  - Browser client: `apps/web/src/lib/supabaseClient.ts` and `apps/admin/src/lib/supabaseClient.ts` (using `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`).
  - Server client & auth hooks: `$lib/server/supabase.ts`, `$lib/server/auth-guards.ts`, and `hooks.server.ts` in both apps.
  - Server DB connection: `$lib/server/db.ts` in both apps (connecting via `@csweek/db` using `DATABASE_URL`).

## Payments
Not implemented. All registrations are free (see DECISIONS.md).

## Data Access
- ORM: Drizzle (drizzle-orm + drizzle-kit), connecting directly to the
  Supabase Postgres pooler connection (DATABASE_URL, service-level — not
  the public anon key).
- Supabase is still used for Auth (sign-up/login/session) and Storage.
  Supabase's JS client (`@supabase/supabase-js`) is retained ONLY for
  `supabase.auth.*` calls — all data reads/writes go through Drizzle.
- Schema defined in `schema.ts` (TypeScript), migrations generated via
  `drizzle-kit generate` / applied via `drizzle-kit push`.
- IMPORTANT: Drizzle connects directly to Postgres and BYPASSES Row Level
  Security. RLS policies remain in place as defense-in-depth only.
  Authorization is enforced in application code — see `AUTHORIZATION.md`.

## Deployment
- Push to `main` → Vercel prod
- Push to feature branch → Vercel preview (staging validation)
