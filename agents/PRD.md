# CASC4D3 — Product Requirements Document

> **43rd Computer Science Week Website**
> Last updated: 2026-08-29

---

## 1. Product Overview

### 1.1 Purpose
CASC4D3 is the official website for the 43rd Computer Science Week at UPLB. It serves two audiences:
1. **Participants** — browse events and register anonymously (no accounts required)
2. **Organizers / Admins** — manage events, view registrations, and export data

### 1.2 Project Type
Single-use event website for a one-week academic event. Solo developer, AI-assisted ("vibe-coding") with deliberate engineering discipline.

### 1.3 Key Constraints
- All events are **free** — no payment processing (PayMongo/payments descoped entirely)
- Registration is **anonymous** — no participant accounts, no login required for the public site
- Solo developer — manual testing is primary QA strategy
- Proof-of-payment uploads (for manual external payments like GCash) are image evidence only, NOT in-app payment processing

---

## 2. Architecture

### 2.1 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | SvelteKit (Svelte 5) + TypeScript |
| **Data Layer** | Drizzle ORM (direct Postgres connection) |
| **Auth** | Supabase Auth (admin-only) |
| **Storage** | Supabase Storage (file uploads) |
| **Database** | Supabase Postgres (pooler connection) |
| **Hosting** | Vercel (two separate projects) |
| **Package Manager** | Bun |
| **Build Tool** | Vite 5 |

> **Historical note:** Project was originally scaffolded with Next.js (`next-scaffold/`, abandoned Aug 15). Rebuilt on SvelteKit. The Next.js scaffold is kept for history only.

### 2.2 Monorepo Structure

```
/
├── apps/
│   ├── web/              # Public-facing SvelteKit app
│   │   └── src/
│   │       ├── routes/
│   │       │   ├── +layout.svelte        # Shell: header, nav, footer
│   │       │   ├── +page.svelte          # Homepage (hero, upcoming events)
│   │       │   ├── +page.server.ts       # Homepage data (3 upcoming open events)
│   │       │   └── events/
│   │       │       ├── +page.svelte      # Event listing
│   │       │       ├── +page.server.ts   # Events query
│   │       │       └── [id]/
│   │       │           ├── +page.svelte  # Event detail + registration form
│   │       │           └── +page.server.ts # Event load + register action
│   │       └── lib/
│   │           └── server/
│   │               ├── db.ts             # Drizzle connection (DATABASE_URL)
│   │               └── supabase.ts       # Service-role client (file uploads)
│   │
│   └── admin/            # Admin-facing SvelteKit app
│       └── src/
│           ├── routes/
│           │   ├── +layout.svelte        # Root layout
│           │   ├── login/                # Admin login
│           │   └── admin/
│           │       ├── +layout.server.ts  # Role gate (requireAdmin)
│           │       ├── +layout.svelte     # Admin shell (sidebar + topbar)
│           │       ├── +page.svelte       # Dashboard overview (stats)
│           │       ├── +page.server.ts    # Overview data (counts)
│           │       ├── events/
│           │       │   ├── +page.svelte   # Event list
│           │       │   ├── new/           # Create event
│           │       │   └── [id]/edit/     # Edit event
│           │       └── registrations/
│           │           ├── +page.svelte   # Registration table
│           │           ├── export/        # CSV export endpoint
│           │           └── file/          # Signed URL file proxy
│           └── lib/
│               ├── components/
│               │   └── AppSidebar.svelte  # Sidebar navigation
│               └── server/
│                   ├── db.ts              # Drizzle connection
│                   ├── supabase.ts        # Server Supabase client
│                   └── auth-guards.ts     # requireSession / requireAdmin
│
├── packages/
│   └── db/               # Shared Drizzle schema + connection factory
│       └── src/
│           ├── schema.ts      # Table definitions (source of truth)
│           ├── index.ts       # createDb factory
│           └── anonymous.ts   # ANONYMOUS_USER_ID constant
│
├── supabase/
│   └── migrations/        # SQL migrations (RLS, triggers, storage)
│
├── plans/                 # Sprint plans
├── agents/                # Project documentation (this directory)
└── .agents/               # AI workflow skills
```

### 2.3 Deployment

| App | Vercel Project | URL |
|---|---|---|
| `apps/web` | Separate Vercel project | Public site |
| `apps/admin` | Separate Vercel project | Admin console |

- **Production:** Push to `main` → Vercel prod
- **Staging:** Push to feature branch → Vercel preview

### 2.4 Environment Variables

| Variable | Used By | Purpose |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | web, admin | Supabase project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | admin | Supabase anon key (auth) |
| `DATABASE_URL` | web, admin | Postgres pooler connection for Drizzle |
| `SUPABASE_SERVICE_ROLE_KEY` | web, admin | Server-side uploads + admin ops |

> `apps/web` no longer uses `PUBLIC_SUPABASE_ANON_KEY` (no client-side Supabase after removing participant auth).

---

## 3. Database Schema

All tables defined in `packages/db/src/schema.ts` (Drizzle ORM, TypeScript — single source of truth).

### 3.1 Tables

#### `profiles`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | FK to `auth.users` |
| `full_name` | text | |
| `role` | text | `'participant'` or `'admin'` (check constraint) |
| `created_at` | timestamptz | |

- One special row: `ANONYMOUS_USER_ID` (`d686bd46-…1562`) — the shared identity for all public web registrations.
- Auto-created for real auth users via `handle_new_user` trigger on `auth.users`.

#### `events`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | Auto-generated |
| `title` | text | Required |
| `description` | text | |
| `start_at` | timestamptz | Required |
| `end_at` | timestamptz | |
| `capacity` | integer | Nullable (unlimited if null) |
| `status` | text | `'draft'`, `'open'`, or `'closed'` (check constraint) |
| `created_at` | timestamptz | |

Index: `events_status_start_at_idx (status, start_at)` — optimizes the "open & upcoming" homepage query.

#### `registrations`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | Auto-generated |
| `event_id` | uuid (FK → events) | Cascade delete |
| `user_id` | uuid (FK → profiles) | Always `ANONYMOUS_USER_ID` for web submissions |
| `status` | text | `'pending'`, `'confirmed'`, or `'cancelled'` (check constraint) |
| `responses` | jsonb | Participant answers keyed by `field_key` |
| `created_at` | timestamptz | |

- Partial unique index `event_user_unique` on `(event_id, user_id)` WHERE `user_id <> ANONYMOUS_USER_ID` — prevents duplicate registrations for authenticated users while allowing unlimited anonymous submissions.
- Index: `registrations_status_created_at_idx (status, created_at)`.

#### `event_registration_fields`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | Auto-generated |
| `event_id` | uuid (FK → events) | Cascade delete |
| `field_key` | text | Unique per event |
| `label` | text | Display label |
| `field_type` | text | `'text'`, `'number'`, `'email'`, `'select'`, `'checkbox'`, `'file'` |
| `options` | jsonb | For `select` fields (array of choice strings) |
| `is_required` | boolean | Flat boolean, no conditional logic |
| `sort_order` | integer | Render order |
| `created_at` | timestamptz | |

Unique index: `event_field_unique` on `(event_id, field_key)`.

### 3.2 Storage

- **Bucket:** `registration-uploads` (private, images only, 4 MB limit)
- **Path convention:** `{ANONYMOUS_USER_ID}/{event_id}/{timestamp}-{random}-{filename}`
- Uploads are **immutable** (timestamped paths, no upserts)
- Written server-side via `SUPABASE_SERVICE_ROLE_KEY`

### 3.3 Migrations

| File | Purpose |
|---|---|
| `packages/db/src/schema.ts` | Drizzle schema (source of truth) |
| `drizzle/0001_giant_wildside.sql` | Added `file` to field_type check constraint |
| `drizzle/0002_pretty_krista_starr.sql` | Performance indexes |
| `drizzle/0003_milky_living_tribunal.sql` | Anonymous user ID + partial unique index |
| `supabase/migrations/20260821_enable_rls.sql` | RLS policies on all tables |
| `supabase/migrations/20260825_handle_new_user_trigger.sql` | Auto-create profile on signup |
| `supabase/migrations/20260825_registration_uploads_storage.sql` | Storage bucket + policies |

### 3.4 Seed Data

Script: `packages/db/scripts/seed-registration-fields.mjs` (idempotent, run with `bun`)

Seeds 3 events with 36 total registration fields:
1. **Career Orientation** — 11 fields (personal info, year level, SHS track/strand, college fields)
2. **Warframes / "Web Design"** — team registration (1–3 members), proof-of-payment file upload
3. **Games Day** — team of 5 + optional reserve

All events include a required RA 10173 data privacy consent field at `sort_order: 0`.

---

## 4. Authentication & Authorization

### 4.1 Auth Model
- **Public web app:** No authentication at all. Registration is anonymous.
- **Admin app:** Supabase Auth (email + password) — admin-only sign-in.

### 4.2 Enforcement Layers (ordered by priority)

1. **Application-level checks (source of truth):**
   - `requireSession()` — verifies `event.locals.user` exists
   - `requireAdmin()` — verifies session + `profiles.role = 'admin'` via Drizzle query
   - Every admin server action / load function calls these before executing
   - **Drizzle bypasses RLS** — app-level checks are mandatory, not optional

2. **Route-level guards:**
   - `apps/admin/src/routes/admin/+layout.server.ts` — calls `requireAdmin()`, redirects non-admins
   - `apps/admin/src/hooks.server.ts` — session hydration for all requests

3. **RLS policies (defense-in-depth only):**
   - `events` — public SELECT; admin-only INSERT/UPDATE/DELETE
   - `registrations` — own-row SELECT or admin all; no public INSERT; admin-only UPDATE
   - `profiles` — own-row SELECT/UPDATE (role locked); admin SELECT all
   - `event_registration_fields` — public SELECT; admin-only ALL
   - Storage: authenticated INSERT own folder; admin-only SELECT; no UPDATE/DELETE

### 4.3 Access Rules Summary

| Resource | Public (anonymous) | Admin |
|---|---|---|
| Homepage, events listing, event detail | ✅ Read | ✅ Read |
| Registration form submission | ✅ Submit | ✅ Submit |
| `/admin/*` dashboard | ❌ Redirect/403 | ✅ Full access |
| Event CRUD | ❌ | ✅ Create/edit/close |
| Registration table | ❌ | ✅ View/filter/search |
| CSV export | ❌ | ✅ Download |
| Uploaded files | ❌ | ✅ Signed URL (5 min) |

---

## 5. Features — Implemented ✅

### 5.1 Public Web App (`apps/web`)

#### Homepage (`/`)
- Hero section with CTA buttons
- Upcoming events preview (up to 3 open events, `start_at >= now()`)
- "Why attend" / "How it works" sections
- Responsive layout with `clamp()` sizing
- Empty state: "No events open yet — check back soon."
- Title: **CASC4D3**

#### Events Listing (`/events`)
- Lists all events from the database
- Filterable by status/date
- Loading, empty, and error states handled

#### Event Detail + Registration (`/events/[id]`)
- Event description, schedule, capacity display
- **Dynamic registration form** — fields rendered from `event_registration_fields` in sort order
- Supported field types: `text`, `number`, `email`, `select`, `checkbox`, `file`
- Client + server validation against field definitions
- File upload: image-only, ≤ 4 MB, uploaded server-side via service role
- Capacity check: blocks registration when event is full
- Confirmation screen on success
- Invalid/missing event → controlled error state
- Timezone: `en-PH` / `Asia/Manila`

#### Layout / Navigation
- Sticky header with brand mark + navigation links
- Mobile hamburger menu at ≤ 720px
- Footer with branding
- No auth-related UI (no login/signup/logout buttons)

### 5.2 Admin App (`apps/admin`)

#### Login (`/login`)
- Email + password form
- Supabase Auth (cookie-based SSR)
- Redirects to `/admin` on success

#### Dashboard Overview (`/admin`)
- Stat cards: open events count, pending registrations, confirmed registrations
- Quick-action task tiles
- Enriched server load with live counts

#### Event Management (`/admin/events`)
- **List:** All events with status badges, capacity indicators, edit links
- **Create** (`/admin/events/new`): Form with title, description, dates, capacity, status
- **Edit** (`/admin/events/[id]/edit`): Pre-populated form, capacity-reduction guard (rejects if below current registration count)
- **Close:** Set status to `'closed'`

#### Registration Management (`/admin/registrations`)
- Table view: all registrations with joined event + participant data
- **Search** by participant name (`ilike`)
- **Filter** by registration status
- **Response drilldown:** expandable `<details>` rows showing individual responses
- **File responses:** "View uploaded image" links → admin-only signed URL endpoint (5 min expiry)
- **CSV Export** (`/admin/registrations/export`):
  - GET endpoint, respects `q` and `status` query params
  - Dynamic registration fields flattened into additional columns
  - Proper `Content-Type` header for CSV download

#### Admin Shell / Design System
- **Theme:** Sakura — dusky-rose palette on warm paper backgrounds
- **Typography:** Shippori Mincho (display), IBM Plex Sans (body/UI)
- **Sidebar:** Sticky 248px, active rose-stem indicator, collapses to top bar at < 720px
- **Topbar:** Signed-in avatar + name
- Shared utilities: `.btn*`, `.field`, `.badge*`, `.status-msg`, `.eyebrow`
- Focus-visible rings, hover states, reduced-motion support
- See `agents/DESIGN_TOKENS.md` for full token reference

### 5.3 Performance Optimizations (Implemented)
- **Auth cold-path removal:** `hooks.server.ts` skips `supabase.auth.getUser()` when no `sb-*-auth-token` cookie exists — eliminates Supabase round-trip for anonymous visitors
- **Connection tuning:** Drizzle client uses `{ prepare: false, max: 1 }` for Supabase transaction pooler compatibility
- **Database indexes:** Composite indexes on `(status, start_at)` and `(status, created_at)` for common query patterns

### 5.4 Security (Implemented)
- RLS enabled on all four public tables (defense-in-depth)
- Storage bucket policies (authenticated INSERT own folder, admin-only SELECT)
- App-level `requireSession()` / `requireAdmin()` on every admin operation
- Capacity-reduction guard on event editing
- File upload validation (image type, 4 MB limit)
- Uploads only happen after duplicate/capacity checks pass (no orphaned files)
- `role` column locked via `WITH CHECK` — users cannot self-promote to admin
- Service-role key used server-side only, never exposed to client

---

## 6. Features — NOT Implemented ❌

### 6.1 Deferred / Remaining Work

| Feature | Sprint | Status |
|---|---|---|
| Confirmation email | Sprint 3 | Not started |
| Email delivery testing | Sprint 3 | Not started |
| Mobile responsiveness pass (both apps) | Sprint 5 | Partial (homepage only) |
| Loading/empty/error states audit | Sprint 5 | Partial |
| SEO / meta tags / OG image | Sprint 5 | Basic title only |
| Registration rate limiting | Sprint 5 | Not started |
| Auth edge case review | Sprint 5 | Not started |
| Production config check | Sprint 5 | Not started |
| Database backup/recovery check | Sprint 5 | Not started |
| Bug fixes from prior sprints | Sprint 5 | Ongoing |
| Full manual regression test | Sprint 6 | Not started |
| Final event content | Sprint 6 | Not started |
| Soft launch | Sprint 6 | Not started |
| Go-live | Sprint 6 | Not started |
| Branding assets (external) | Sprint 0 | Not received |
| Staging deploy confirmation (web) | Sprint 1 | Not confirmed |
| Conditional required-field logic | Deferred | By design (see Decisions) |

### 6.2 Explicitly Out of Scope
- Payments / PayMongo (all events are free)
- Multi-org / multi-tenant support
- Native mobile app
- Ticket resale/transfer
- Participant accounts / login (removed Aug 29)

---

## 7. Events — Launch Roster

| Event | Registration | Special Fields |
|---|---|---|
| **Career Orientation** | ✅ Dynamic form | SHS track/strand (optional), college fields (optional) |
| **Warframes / "Web Design"** | ✅ Dynamic form | Team (1–3), proof-of-payment file upload (required) |
| **Games Day** | ✅ Dynamic form | Team of 5 + optional reserve |
| Code Wars | Listed | No registration fields seeded |
| Job Fair | Listed | No registration fields seeded |

All registration-enabled events include a mandatory RA 10173 (Data Privacy Act) consent field.

---

## 8. Design System

### 8.1 Visual Identity
- **Theme name:** Sakura — "Sakura, but not flowery"
- Japanese influence through color palette and Mincho display typeface, not decoration
- Warm paper backgrounds (`#faf7f4`), rose-tinted hairline borders

### 8.2 Color Palette

| Token | Hex | Role |
|---|---|---|
| `--rose-700` | `#a63a5c` | Primary brand / buttons |
| `--rose-600` | `#c25072` | Accent / focus borders |
| `--rose-100` | `#f6e3e9` | Pale wash / active states |
| `--rose-900` | `#7a1f3d` | Deep ink-rose / gradients |
| `--plum` | `#2b2430` | Ink text |
| `--plum-soft` | `#6f6676` | Muted/secondary text |
| `--paper` | `#faf7f4` | Page background |
| `--ok` | `#3e7a5c` | Confirmed / open |
| `--warn` | `#b7791f` | Pending / draft |
| `--danger` | `#b13a3a` | Cancelled / errors |

### 8.3 Typography
- **Display:** Shippori Mincho (500, 600, 700) — headings, brand, stat values
- **Body/UI:** IBM Plex Sans (400, 500, 600, 700) — everything else
- Loaded via Google Fonts

### 8.4 Layout
- Max content width: 1080px
- Admin sidebar: 248px (sticky), collapses at 720px
- Web header: 64px sticky with backdrop blur
- Card radius: 12px (web), 10px (admin)

Full token reference: [`agents/DESIGN_TOKENS.md`](DESIGN_TOKENS.md)

---

## 9. Testing Strategy

### 9.1 Approach
Manual testing is primary (solo project). Prioritized by risk: auth, data integrity, file uploads.

### 9.2 Critical Path Checklist
- [ ] Public pages load without requiring a session
- [ ] No login/signup/logout links in the public site
- [ ] Browse events, open event detail
- [ ] Register for an event (success case)
- [ ] Admin: login, create/edit/close event
- [ ] Admin: view registrations, export CSV
- [ ] Unauthorized user blocked from `/admin`
- [ ] Mobile responsiveness across core pages
- [ ] File upload: rejects non-images and > 4 MB
- [ ] File upload: successful upload stores only storage path
- [ ] Failed registration doesn't leave orphaned uploads
- [ ] Admin file viewer serves signed URL, expires in ~5 min

### 9.3 Tooling
- Playwright for smoke tests (optional, not yet adopted)

---

## 10. Sprint Progress

| Sprint | Goal | Status |
|---|---|---|
| Sprint 0 | Foundations | ✅ Complete |
| Sprint 1 | Auth & Public Shell | ✅ Complete (except staging deploy confirmation) |
| Sprint 2 | Events | ✅ Complete |
| Sprint 3 | Registration | ✅ Complete (except confirmation email) |
| Sprint 4 | Admin Dashboard | ✅ Complete |
| Sprint 5 | Hardening & Polish | ⬜ Not started |
| Sprint 6 | QA, Soft Launch & Production | ⬜ Not started |

---

## 11. Key Decisions

| Date | Decision | Rationale |
|---|---|---|
| 2026-08-15 | SvelteKit replaces Next.js | Rebuilt after initial scaffold |
| 2026-08-15 | Payments descoped entirely | All events free; simplifies build |
| 2026-08-16 | Dynamic registration fields (jsonb) | Avoids migration-per-event |
| 2026-08-16 | Drizzle ORM replaces Supabase queries | Type-safe schema-as-code |
| 2026-08-16 | RLS demoted to defense-in-depth | Drizzle bypasses RLS |
| 2026-08-25 | Conditional field logic deferred | `is_required` is flat boolean; ship simple |
| 2026-08-25 | RA 10173 consent field on all events | Data Privacy Act compliance |
| 2026-08-29 | Participant accounts removed | Anonymous-first; no-signup UX |

Full log: [`agents/DECISIONS.md`](DECISIONS.md)

---

## 12. Documentation Index

| Document | Purpose |
|---|---|
| [`agents/AGENTS.md`](AGENTS.md) | Documentation index |
| [`agents/ARCHITECTURE.md`](ARCHITECTURE.md) | Stack, folder structure, environments |
| [`agents/DATABASE.md`](DATABASE.md) | Schema, migrations, relationships |
| [`agents/AUTHORIZATION.md`](AUTHORIZATION.md) | Roles, RLS policies, access rules |
| [`agents/API.md`](API.md) | Endpoints and route actions |
| [`agents/UI.md`](UI.md) | Design conventions, component inventory |
| [`agents/DESIGN_TOKENS.md`](DESIGN_TOKENS.md) | Full design system tokens |
| [`agents/TESTING.md`](TESTING.md) | Test strategy, QA checklists |
| [`agents/WORKFLOW.md`](WORKFLOW.md) | Sprint cadence, guardrails |
| [`agents/DECISIONS.md`](DECISIONS.md) | Decision log |
| [`agents/PROGRESS.md`](PROGRESS.md) | Work completed (append-only) |
| [`agents/features/*.md`](features/) | Per-feature specs |
| [`plans/cs-week-website-plan.md`](../plans/cs-week-website-plan.md) | Sprint plan (canonical) |
