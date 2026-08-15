# CS Week Website — Solo Agile Sprint Plan

## Project Context

**Project:** CS Week event website
**Stack:** SvelteKit (apps/web + apps/admin) + Supabase (Auth, Postgres, Storage) + Vercel
**Payments:** Not implemented — all events are free registration (see /agents/DECISIONS.md)
**Team:** Solo developer
**Development style:** Fast, AI-assisted ("vibe-coding") with deliberate engineering discipline
**Design:** UI/UX work is embedded directly into implementation tasks; no separate design phase
**Cadence:** 6 weekly sprints + Sprint 0 foundation period
**Environment:** Local → staging → production

> **Framework note:** Originally scaffolded with Next.js (`next-scaffold/`, abandoned). Current and only active frontend is SvelteKit, split into `apps/web` (public site) and `apps/admin` (admin dashboard). See `agents/DECISIONS.md` and `agents/ARCHITECTURE.md`.

## Recent repository updates

- `next-scaffold/` removed from the repository (archival scaffold was deleted to avoid confusion).
- Frontend confirmed: **SvelteKit** (`apps/admin` skeleton created). See [apps/admin/README.md](apps/admin/README.md).
- Supabase client added for admin at `apps/admin/src/lib/supabaseClient.ts`.
- Environment handling: `.env.example` was untracked and removed from the repo; a local `.env` file was created for development. Ensure any shared examples contain no secrets.

## Immediate next actions (recommended)
- Sprint 1: Scaffold `apps/web` (public SvelteKit site) — create `package.json`, `+layout.svelte`, and Supabase client sharing pattern.
- Implement Supabase Auth and RLS patterns (Sprint 1 / Sprint 5 hardening) following `agents/auth-and-rls` skill.
- Sprint 2 prep: add `scripts/seed.*` or a migration seed to create 3–5 test events.
- Sprint 3 prep: design server action / RPC for atomic registration and idempotency.


Each sprint has:
- One primary sprint goal
- Explicit Definition of Done
- A working increment at the end
- Self-review before moving forward
- Staging validation before production-impacting changes

---

# Sprint 0 — Foundations ✅ COMPLETE
**Duration:** 3–4 days
**Goal:** Establish a safe development foundation before feature work begins.

### Tasks
- [x] Define backlog and core entities: events, registrations, users/profiles, roles
- [x] Define page list and required admin actions
- [x] Initialize repository (Next.js scaffold, later replaced by SvelteKit)
- [x] Create/connect Supabase project
- [x] Establish local, staging (Vercel), and production environments
- [x] Configure Vercel deployment pipeline
- [x] Define environment variables and secret-management approach
- [x] Design initial database schema
- [x] Establish Supabase migration strategy
- [x] Scaffold `apps/admin` (SvelteKit admin skeleton)
- [ ] Scaffold `apps/web` (SvelteKit public site) — **carried into Sprint 1**
- [ ] Gather externally supplied branding assets
- [x] ~~Confirm PayMongo~~ — payments descoped, no longer required
- [x] Create basic project README covering setup and deployment

### Definition of Done
- [x] Local app runs from a clean setup
- [x] Staging deployment works
- [x] Database schema can be reproduced through migrations
- [x] Required secrets/configuration are documented
- [x] No production secrets are stored in source control

---

# Sprint 1 — Authentication & Public Shell
**Goal:** Establish the site's public structure and secure authentication foundation.

### Tasks
- [ ] Scaffold `apps/web` SvelteKit project (routes, lib, Supabase client)
- [ ] Supabase Auth: participant sign-up/login/logout (SvelteKit form actions)
- [ ] Profile/role handling
- [ ] Admin role representation
- [ ] Protected-route foundation (`hooks.server.ts` session/role checks)
- [ ] Base layout, navigation, footer (`+layout.svelte`)
- [ ] Homepage hero
- [ ] Flagship event highlight
- [ ] Upcoming-events preview
- [ ] Responsive baseline
- [ ] Deploy `apps/web` to staging

### Definition of Done
- User can sign up, log in, and log out
- Unauthorized users cannot access protected functionality
- Public homepage works on desktop and mobile
- Staging deployment passes smoke test
- No critical console/runtime errors

---

# Sprint 2 — Events
**Goal:** Deliver a complete read-only event browsing experience.

### Tasks
- [ ] Events listing page (`routes/events/+page.svelte` + `+page.server.ts` load)
- [ ] Query events from Supabase
- [ ] Filter by status/date
- [ ] Event detail page (`routes/events/[id]/+page.svelte`)
- [ ] Display description, schedule, and capacity
- [ ] Handle loading, empty, and error states
- [ ] Seed 3–5 realistic test events
- [ ] Define event timezone behavior

### Definition of Done
- Events are loaded from the database rather than hardcoded
- Users can browse and open individual events
- Invalid/missing events produce a controlled error state
- Loading and empty states work
- Event dates/times display consistently in the intended timezone
- Staging smoke test passes

---

# Sprint 3 — Registration
**Goal:** Deliver the complete (free) registration flow end to end.

### Tasks
- [ ] Registration form
- [ ] Client/server validation
- [ ] Registration database write (SvelteKit form action)
- [ ] Duplicate-registration prevention
- [ ] Capacity check (block registration once event is full)
- [ ] Confirmation screen
- [ ] Confirmation email
- [ ] Email delivery test
- [ ] Define registration idempotency behavior

### Definition of Done
- A logged-in participant can successfully register for an event
- Invalid submissions are rejected safely
- Duplicate registration cannot create duplicate records
- Registration is blocked once an event reaches capacity
- Successful registration produces the correct database state
- Confirmation email is actually received
- Repeated requests do not corrupt registration state

---

# Sprint 4 — Admin Dashboard
**Goal:** Give the organizer enough tooling to operate the event.

### Tasks
- [ ] Protected `/admin` route (`apps/admin`, `hooks.server.ts` role gate)
- [ ] Role-based access enforcement
- [ ] Event CRUD
- [ ] Create/edit/close events
- [ ] Set capacity
- [ ] Registration table
- [ ] Search/filter registrations
- [ ] CSV export

### Definition of Done
- Non-admin users cannot access admin functionality
- Admin can create, edit, and close events
- Admin can inspect registrations
- CSV export produces usable data
- Critical admin actions have appropriate validation/error handling

### Deferrable if Sprint Slips
1. CSV export
2. Advanced filtering

---

# Sprint 5 — Hardening & Polish
**Goal:** Remove launch-blocking defects and make the application production-ready.

### Tasks
- [ ] Mobile responsiveness pass (both apps)
- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Basic SEO/meta tags
- [ ] OG image
- [ ] Registration endpoint abuse/rate limiting
- [ ] Review authentication edge cases
- [ ] Review authorization/RLS policies
- [ ] Production configuration check
- [ ] Database backup/recovery check
- [ ] Fix accumulated bugs from previous sprints

### Definition of Done
- No known critical/high-severity defects
- Registration endpoints have defined abuse protection
- RLS/authorization rules have been manually verified
- Production environment variables are correct
- Backup/recovery procedure is known
- Mobile smoke test passes
- Core user flows work after a clean deployment

### Contingency Rule
Sprint 5 may absorb unfinished work from earlier sprints, but only explicitly identified non-critical features may be deferred.

---

# Sprint 6 — QA, Soft Launch & Production
**Goal:** Validate the complete system in realistic conditions and launch safely.

### Tasks
- [ ] Full manual regression test (both apps)
- [ ] Registration test (success, duplicate, at-capacity)
- [ ] Admin CRUD test
- [ ] Expired/closed event test
- [ ] Unauthorized-access test
- [ ] Mobile test
- [ ] Load final event content
- [ ] Remove/close test data
- [ ] Verify production environment configuration
- [ ] Soft launch to a small group
- [ ] Monitor Supabase/Vercel logs
- [ ] Fix launch-blocking issues
- [ ] Go-live

### Definition of Done
- All critical user journeys pass
- No known launch-blocking defects remain
- Soft-launch users can complete the intended flows
- Production monitoring is working
- Final content is loaded
- Production deployment is verified
- Go-live smoke test passes

---

# Solo Engineer Guardrails

For every sprint:

### Before starting
- [ ] Sprint goal is achievable within one week
- [ ] Dependencies are available
- [ ] External services required for the sprint are accessible

### Before marking complete
- [ ] Feature works locally
- [ ] Feature works on staging
- [ ] Error/empty/loading states considered
- [ ] Authorization/security behavior checked
- [ ] Database changes use migrations
- [ ] No secrets committed
- [ ] Critical flow manually tested

### Before production
- [ ] Staging smoke test passes
- [ ] Production environment variables verified
- [ ] Database backup/recovery path exists
- [ ] Rollback path is understood
- [ ] Core user journey tested from a clean browser/session

---

# Project Rule

Do not use "Sprint 5 will absorb it" as permission to continuously add scope.

If a sprint slips:
1. Keep the sprint goal intact.
2. Defer explicitly non-critical work.
3. Never defer security or data-integrity work merely to hit the schedule.
4. Reassess the next sprint before starting it.