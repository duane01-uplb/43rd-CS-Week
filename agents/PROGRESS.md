# Progress Log

Append-only log of notable work completed. Newest entries at the top.
Do not delete history — only append. For the "why" behind a decision, see
`DECISIONS.md`; this file is the "what/when" companion to that log.

---

## 2026-08-16 — Sprint 0 infra fixes
- Fixed `apps/web/tsconfig.json`: `extends` incorrectly pointed to
  `../../tsconfig.base.json` instead of `./.svelte-kit/tsconfig.json`,
  breaking `$env` virtual module resolution.
- Added missing `apps/admin/src/env.d.ts` (ambient declarations for
  `$env/static/public` etc.), mirroring `apps/web/src/env.d.ts`.
- Diagnosed Vite crash on Windows in `apps/web` (Rolldown/`node:module`
  resolution failure on Vite 8.2.1) — downgrade to Vite 5 recommended,
  not yet applied to `package.json`.
- Resolved Vercel `NOT_FOUND` errors by splitting into two separate Vercel
  Projects (`apps/web`, `apps/admin`) with correct root directories and
  per-app env vars.
- Confirmed Supabase direct host is IPv6-only and fails on local network;
  standardized on pooler host (`aws-0-<region>.pooler.supabase.com`).
- Rotated Supabase JWT secret after live API keys were accidentally
  shared in chat.
- Mid-session Supabase project ref changed:
  `castqnxbszgaxdzkhabd` → `teaoariybarqpkcagtky`. Config drift from this
  change may not be fully resolved — verify ref consistency across
  `supabase/.temp/`, `.env`, and Vercel env vars before next deploy.

## 2026-08-16 — Data layer migration
- Migrated data access from raw Supabase SQL + supabase-js queries to
  Drizzle ORM (direct Postgres connection). Supabase retained for
  Auth/Storage only.
- Added `event_registration_fields` table + `registrations.responses`
  jsonb column for per-event dynamic registration fields (organizer
  requirements not yet finalized).
- Demoted RLS to defense-in-depth; `requireSession()` / `requireAdmin()`
  app-level guards are the enforcement source of truth (Drizzle bypasses
  RLS).

## 2026-08-15 — Framework pivot
- Abandoned Next.js scaffold (`next-scaffold/`), rebuilt frontend on
  SvelteKit as `apps/web` (public) + `apps/admin` (admin dashboard).
- Dropped PayMongo/payments from scope entirely; all events are free
  registration. Schema cleaned up via `0002_remove_payments.sql`.

---

## Sprint 0 status: INCOMPLETE
Outstanding: branding assets, staging deployment confirmation, service
role key verification in Vercel. See `plans/cs-week-website-plan.md`.
