# Progress Log

Append-only log of notable work completed. Newest entries at the top.
Do not delete history — only append. For the "why" behind a decision, see
`DECISIONS.md`; this file is the "what/when" companion to that log.

---

## 2026-08-29 — Split design docs: DESIGN_TOKENS.md + UI.md handoff brief
- **NEW `agents/DESIGN_TOKENS.md`:** single source of truth for everything
  visual (palette incl. status colors, typography + scale, radii/elevation,
  motion, layout/breakpoints, shared utility classes, component anatomy,
  brand mark, required states). Tokens are duplicated in each app's root
  layout `:root` and must stay in sync (noted in the doc).
- **`agents/UI.md` rewritten as a handoff brief** for another model building
  the UI: what we're building (web + admin), infra to match (Bun, SvelteKit/
  Svelte 5 runes, Drizzle, Supabase, Vercel), route inventory + auth per app,
  anonymous-registration data rules, pointer to DESIGN_TOKENS.md, component
  inventory, conventions (runes, CSS-variable-only, a11y, en-PH dates), and
  a verify checklist.
- **`agents/AGENTS.md`** index row updated: UI.md owns the handoff brief,
  DESIGN_TOKENS.md owns the design system.

## 2026-08-29 — Removed participant auth from the public web app (anonymous registration)
- **Scope change:** participant sign-up/login/logout dropped from `apps/web`
  (DECISIONS.md 2026-08-29). Auth now exists only in `apps/admin`. Public
  registration is anonymous.
- **Web:** deleted `apps/web/src/routes/{login,signup,logout}/`, plus the web
  `hooks.server.ts`, `lib/server/auth-guards.ts`, `lib/supabaseClient.ts`, and
  `+layout.server.ts` (no more session plumbing/cookies). Header, mobile menu,
  and footer no longer show sign-in/sign-up/log-out controls; homepage
  "How it works" step 2 rewritten to "Tell us about you" (no account mention).
- **Registration:** `events/[id]/+page.server.ts` `register` action no longer
  requires a session — no redirect-to-login, no per-user duplicate check (none
  is possible anonymously). Inserts pin `user_id` to the new shared
  `ANONYMOUS_USER_ID` and upload file answers server-side via
  `SUPABASE_SERVICE_ROLE_KEY` at `{ANONYMOUS_USER_ID}/{event_id}/{ts}-{rand}-{name}`
  (same `{uuid}/` prefix the admin file endpoint validates).
- **DB (migration `drizzle/0003_milky_living_tribunal.sql`, applied + verified):**
  `event_user_unique` is now a partial unique index on `(event_id, user_id)`
  `WHERE user_id <> ANONYMOUS_USER_ID`, and a fixed "Anonymous" profile row
  (`d686bd46-…1562`) was seeded so the FK holds. Constant lives in
  `packages/db/src/anonymous.ts`, re-exported from `@csweek/db`.
- **Env:** web app now needs `SUPABASE_SERVICE_ROLE_KEY` (private, server-only)
  in addition to `PUBLIC_SUPABASE_URL` + `DATABASE_URL`; `PUBLIC_SUPABASE_ANON_KEY`
  is no longer used by the public app.
- **Docs:** ARCHITECTURE/API/PROJECT/TESTING/DATABASE/AUTHORIZATION updated;
  `apps/web/README.md` env list corrected.

## 2026-08-28 — Admin console visual redesign (frontend)
- **Admin design system:** sakura theme via a dusky-rose palette on warm
  paper + Shippori Mincho (display) / IBM Plex Sans (body), defined as CSS
  tokens in `apps/admin/src/routes/+layout.svelte`. No "flowery" decoration —
  the Japanese influence is carried by color + type only.
- **Shell/layout:** new sticky sidebar (`AppSidebar.svelte`) with active
  rose-stem indicator + collapese-to-topbar at <720px; top bar with
  signed-in avatar in `admin/+layout.svelte`. Removed the now-dead
  `AdminShellHeader.svelte`.
- **Pages styled:** Overview (stat cards + task tiles, enriched server
  load with open/pending/confirmed counts), Events list (badges, capacity,
  empty state), create/edit event forms, Registrations (filter bar, empty
  states, response drilldown), login card.
- Shared utilities (`.btn*`, `.field`, `.badge*`, `.status-msg`,
  `.eyebrow`) and focus/reduced-motion respected globally.
- Design tokens documented in `agents/UI.md`.

## 2026-08-28 — Admin/registration performance investigation + fixes
- **Auth cold path removed:** both `hooks.server.ts` (web + admin) now skip
  `supabase.auth.getUser()` when no `sb-*-auth-token` cookie is present,
  short-circuiting `event.locals.user = null` for anonymous visitors. This
  removes an outbound auth-server round-trip from every public page load
  (the main cause of slow TTFB). Logged-in users still get a full verify.
- **Connection tuning:** `createDb` in `packages/db/src/index.ts` now passes
  `{ prepare: false, max: 1 }` to the `postgres()` client — required for
  Drizzle against Supabase's transaction pooler (port 6543) and to keep
  per-serverless-instance connection counts low.
- **Index migration (`drizzle/0002_pretty_krista_starr.sql`):**
  `events_status_start_at_idx (status, start_at)` and
  `registrations_status_created_at_idx (status, created_at)` — generated,
  reviewed, NOT yet applied to the live DB (needs a proper DIRECT connection
  to run `drizzle-kit push`).
- **Doc:** DATABASE.md indexes section updated.


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