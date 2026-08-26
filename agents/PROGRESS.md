# Progress Log

Append-only log of notable work completed. Newest entries at the top.
Do not delete history — only append. For the "why" behind a decision, see
`DECISIONS.md`; this file is the "what/when" companion to that log.

---

## 2026-08-26 — Homepage upcoming-events preview + responsive baseline (Sprint 1)
- **Scope change:** dropped flagship/featured event concept entirely (removed
  from `agents/features/events.md` and sprint plan). Only upcoming-events
  preview was in scope.
- **New server load:** `apps/web/src/routes/+page.server.ts` queries up to 3
  open events with `start_at >= now()`, sorted ascending. No session check —
  public read, same as `/events`.
- **Homepage UI:** `apps/web/src/routes/+page.svelte` now shows an "Upcoming
  Events" section below the hero with event title, formatted start date/time
  (en-PH / Asia/Manila), description, and link to `/events/{id}`. Empty state
  shows "No events open yet — check back soon."
- **Responsive baseline (homepage only):** CSS uses `clamp()` for heading
  sizing, flexbox column layout for event cards, and a `@media (max-width:
  480px)` breakpoint for tighter padding. No framework or design system added.
- **Sprint 1 checkboxes:** "Upcoming-events preview" and "Responsive baseline"
  checked off; "Flagship event highlight" removed (dropped, not deferred).

## 2026-08-26 — CSV export for registrations (Sprint 4 complete)
- **Export endpoint:** new `apps/admin/src/routes/admin/registrations/export/+server.ts`
  serves a CSV download at GET `/admin/registrations/export`. Admin-only
  (`requireAdmin`). Respects the same `q` and `status` query params as the
  registrations page, so the export matches what's currently filtered. Dynamic
  registration fields are flattened into additional columns.
- **UI:** added "Export CSV" link to the filter form on the registrations page,
  passing current filter state via query params.
- **Sprint 4 definition of done:** CSV export produces usable data — done.

## 2026-08-25 — Registration fields, file upload, storage for the 3 launch events
- **Schema:** added `file` to the `field_type_check` constraint on
  `event_registration_fields` (`packages/db/src/schema.ts`). Generated
  `drizzle/0001_giant_wildside.sql`; note: `drizzle-kit push` did not detect
  the check-constraint change (drizzle-kit 0.28 limitation), so the reviewed
  SQL was applied directly against the DB and verified via `pg_constraint`.
  No Drizzle journal table exists (baseline was push-applied), so this stays
  consistent with prior practice.
- **Storage:** new private bucket `registration-uploads` (images only, 4 MB)
  with policies in `supabase/migrations/20260825_registration_uploads_storage.sql`
  — authenticated INSERT into own `{auth.uid()}/...` folder only; SELECT
  admin-only; no UPDATE/DELETE (uploads immutable, timestamped paths). Applied
  and verified. See AUTHORIZATION.md "Storage" section.
- **Seed:** new idempotent script `packages/db/scripts/seed-registration-fields.mjs`
  (run with bun). DB was empty, so it also created the three events
  (Career Orientation, Warframes, Games Day — placeholder schedules/descriptions,
  adjust via admin dashboard) plus 36 registration fields per organizer specs,
  including the required RA 10173 consent select at sort_order 0 on all three.
- **Conditional fields deferred:** SHS/college (Career Orientation) and
  Warframes members 2–3 seeded `is_required=false`; no show/hide or cross-field
  validation at launch (DECISIONS.md 2026-08-25).
- **Web:** register action now supports `field_type = 'file'` — validates image
  type + 4 MB size (under Vercel's ~4.5 MB request-body cap), uploads via the
  registrant's own session AFTER duplicate/
  capacity checks (no orphaned uploads on rejection), stores only the storage
  path in `responses`. Form uses multipart encoding with an
  `<input type="file" accept="image/*">` branch.
- **Admin:** registrations table now expands to show responses; file-type
  answers render as links through new `/admin/registrations/file` endpoint
  (requireAdmin + path-prefix validation → 5-minute signed URL).
- **Payments scope guard:** proof-of-payment upload is manual-payment evidence
  only; does NOT reverse the payments-descoped decision (DECISIONS.md).

## 2026-08-22 — Docs and dead-code reconciliation
- **Vite 5 downgrade confirmed:** `bun.lock` confirms `vite@5.4.21` in both `apps/web` and `apps/admin`.
- **TypeScript configs verified:** Both `apps/web/tsconfig.json` and `apps/admin/tsconfig.json` correctly extend `./.svelte-kit/tsconfig.json` and enable `strictNullChecks: true` for accurate Drizzle ORM schema type inference.
- **Dead-code removal:** Deleted unused orphaned components `apps/admin/src/lib/components/RegistrationCard.svelte`, `RegistrationSummaryCard.svelte`, and `RegistrationDetailDialog.svelte` after confirming zero references outside their declarations.
- **Architecture documentation sync:** Updated `agents/ARCHITECTURE.md` folder structure and setup references to fully document `apps/web` routes (`/`, `/events`, `/events/[id]`, `/login`, `/signup`, `/logout`) and client/server utilities (`$lib/server/` and `$lib/supabaseClient.ts`) alongside `apps/admin`.

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