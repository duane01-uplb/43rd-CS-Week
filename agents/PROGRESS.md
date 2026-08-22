# Progress Log

Append-only log of notable work completed. Newest entries at the top.
Do not delete history — only append. For the "why" behind a decision, see
`DECISIONS.md`; this file is the "what/when" companion to that log.

---

## 2026-08-22 — Admin edit-event route
- Added `apps/admin/src/routes/admin/events/[id]/edit/` (load +
  update action), fixing the dead link from the events list page.
- Implements capacity-reduction guard: rejects saving a capacity below
  the current registration count (admin.md edge case).

## 2026-08-22 — Docs reconciliation + gap audit
- Synced `AUTHORIZATION.md` and `DECISIONS.md` to reflect the
  2026-08-21 RLS migration (previously undocumented).
- Confirmed against live code that Sprints 1–4 are further along than
  PROGRESS.md reflected: `apps/web` is fully scaffolded (not just
  planned) with working auth, events listing/detail, and registration
  flow; `apps/admin` has working event creation, registration table
  with search/filter, and role-gated layout.
- **Found gap:** `apps/admin/src/routes/admin/events/+page.svelte`
  links to `/admin/events/${event.id}/edit`, but no
  `admin/events/[id]/edit/` route exists — this is currently a dead
  link in the running app. Not yet fixed; tracked as next task.
- **Confirmed still missing** (per plan.md, matches code): edit-event
  page, CSV export (Sprint 4); confirmation email (Sprint 3);
  flagship/upcoming-events homepage preview, responsive baseline,
  staging deploy confirmation (Sprint 1).

## 2026-08-21 — RLS hardening
- Enabled Row Level Security on all four public tables via
  `supabase/migrations/20260821_enable_rls.sql`. See DECISIONS.md and
  AUTHORIZATION.md for policy details. Defense-in-depth only; Drizzle
  connections still bypass RLS, app-level guards remain primary.

---

## 2026-08-16 — Sprint 0 infra fixes
- Fixed `apps/web/tsconfig.json`: `extends` incorrectly pointed to
  `../../tsconfig.base.json` instead of `./.svelte-kit/tsconfig.json`,
  breaking `$env` virtual module resolution.
- Added missing `apps/admin/src/env.d.ts` (ambient declarations for
  `$env/static/public` etc.), mirroring `apps/web/src/env.d.ts`.
- Diagnosed Vite crash on Windows in `apps/web` (Rolldown/`node:module`
  resolution failure on Vite 8.2.1) — downgrade to Vite 5 recommended,
  not yet applied to `package.json`. **(See 2026-08-21 entry: this was
  applied at some point without a log update.)**
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
  RLS). **(See 2026-08-21 entry: guards are now actually implemented in
  both apps, not just designed.)**

## 2026-08-15 — Framework pivot
- Abandoned Next.js scaffold (`next-scaffold/`), rebuilt frontend on
  SvelteKit as `apps/web` (public) + `apps/admin` (admin dashboard).
- Dropped PayMongo/payments from scope entirely; all events are free
  registration. Schema cleaned up via `0002_remove_payments.sql`.

---

## Sprint 0 status: COMPLETE (per plan checkboxes)
`apps/web` scaffold — the one item plan had carried into Sprint 1 — is
done. Outstanding non-Sprint-0 items: branding assets, staging deploy
confirmation for `apps/web`, service role key verification in Vercel.