# UI — Handoff Brief (for the model building the UI)

This file is a **handoff for an AI agent (or human) building the CS Week UI**.
Read it, plus `DESIGN_TOKENS.md` (the visual system — all colors, type,
shape, tokens) and `ARCHITECTURE.md` (infrastructure), then build so the
result matches what already exists. Do not invent new styling; **every value
used in the UI must come from `DESIGN_TOKENS.md`**.

Other context to skim: `PROJECT.md` (what the product is), `DATABASE.md`
(data shapes), `AUTHORIZATION.md` (who can do what), `API.md` (routes/forms),
`TESTING.md` (how to verify).

---

## 1. What we're building

Two SvelteKit apps in one Bun workspace, deployed to Vercel:

- **`apps/web`** — the public CS Week website (43rd Computer Science Week):
  marketing homepage, events browse, event detail + **anonymous registration**
  (no accounts, no login/signup/logout anywhere in web).
- **`apps/admin`** — the admin console: email/password login, overview,
  events CRUD, registrations review/search/export, file serving. This is the
  ONLY place auth lives.

The week runs talks, workshops, and contests. Everyone registers free via
per-event dynamic forms. The look is **sakura but not flowery** — dusky rose
palette, warm paper, Mincho display type, editorial and friendly.

## 2. Infrastructure you must match

| Concern | Choice |
|---|---|
| Package manager | **Bun** workspaces — run `bun`, never `npm`/`npx` |
| Framework | SvelteKit 2.70+ / **Svelte 5 runes** (`$props`, `$state`, `$derived`) |
| Styling | Plain **scoped `<style>`** per component + CSS custom properties (no Tailwind, no CSS libs) |
| DB | Postgres via **Drizzle** (`@csweek/db`) — server-side only, direct connection |
| Auth | **Supabase Auth**, admin-only; email + password |
| Files | Supabase Storage (service-role on server for uploads) |
| Deploy | Vercel, two projects (web + admin) |

- Repo: `apps/web`, `apps/admin`, `packages/db`. Shared db package only —
  **no shared UI/component package yet**; each app defines its own utilities
  and component styles.
- Global shell + all shared utility classes live in each app's
  `src/routes/+layout.svelte` under a `:global(...)` `<style>`. Design tokens
  are duplicated in `:root` per app — keep both in sync (see
  `DESIGN_TOKENS.md`).
- Build both apps: `bun run build` from repo root. Dev: `cd apps/web && bun
  run dev` (or `apps/admin`).
- Environment: see `ARCHITECTURE.md`. Web needs `PUBLIC_SUPABASE_URL` +
  `SUPABASE_SERVICE_ROLE_KEY` (server-only); admin needs the Supabase client
  env pair. Never hardcode or commit secrets.

## 3. Routes you must preserve (do not restructure)

### apps/web — public, no auth
| Route | Loads | Notes |
|---|---|---|
| `/` | featured/open events | hero, prop cards, how-it-works, upcoming events preview, CTA band |
| `/events` | all events | cards of open events |
| `/events/[id]` | event + its dynamic fields | full detail + registration form (form action) |

### apps/admin — auth required (except `/admin/login`)
| Route | Loads | Notes |
|---|---|---|
| `/admin/login` | — | login card; redirects to `/admin` when authed |
| `/admin` | metric counts | stat cards + task tiles |
| `/admin/events` | all events | table w/ status badges |
| `/admin/events/new` | — | create-event form → dynamic fields editor |
| `/admin/events/[id]/edit` | event + field defs | same form, edit mode |
| `/admin/registrations` | registrations | filter bar + search + drilldown |
| `/admin/registrations/export` | — | CSV export (GET with auth redirect) |
| `/admin/registrations/file` | — | signed URL to uploaded file |

Form submissions are **SvelteKit form actions** in `+page.server.ts`; page
data comes from `load`. Admin gating is `requireAdmin()` per route — never
guard client-side only (see `AUTHORIZATION.md`).

## 4. Data model (what the UI renders)

`events`, `profiles`, `registrations`, `event_registration_fields` (per-event
dynamic fields). See `DATABASE.md`.

- **Registrations are anonymous.** No session/user on the web app. A fixed
  constant `ANONYMOUS_USER_ID` (from `packages/db/src/anonymous.ts`) is used
  as the participant. **Do not put login walls in web copy or flow** — the
  registration form is "no account needed, we'll be in touch by email."
- Statuses the UI must represent:
  - event: `draft` / `open` / `closed`
  - registration: `pending` / `confirmed` / `cancelled`
  Badge colors and copy come from `DESIGN_TOKENS.md` §1 (status tokens).
- Registration fields vary per event; the detail page renders whatever
  `event_registration_fields` says (`field_type`: text / textarea / file …),
  and answers come back as jsonb (`responses` keyed by `field_key`). File
  answers store a storage path — render a "view" link, not a raw path.

## 5. Design system

All visual values are in **`design` tokens: `agents/DESIGN_TOKENS.md`**.
Read it before writing any CSS. Highlights to keep straight:

- Palette: rose ramp (`--rose-050…900`) for brand/interaction; `--plum` ink;
  warm `--paper` bg; `--card` white; hairline `--line`; semantic `--ok`
  (confirmed/open), `--warn` (pending/draft), `--danger` (cancelled).
- Type: **Space Mono** (display/techno, restraint: titles/stat values/brand) +
  **IBM Plex Sans** (body/UI). Loaded from Google Fonts in each root layout.
- Shape: card radius 12px web / 10px admin, controls 8px, pills 999px;
  focus ring `0 0 0 3px rgba(194,80,114,.3)` on EVERY focusable element.
- Breakpoints: `720px` (admin sidebar → top bar; web header → hamburger),
  `900px` (hero grid → 1 col), `520px` (tight mobile stacking). Max content
  1080px.
- Motion: 0.12–0.15s ease transitions, hover `-2px` lift, `:active`
  `translateY(1px)`; honor `prefers-reduced-motion: reduce`.
- Ideal / empty / loading / error states required on every data-driven view.

## 6. Component inventory

Build with the existing components in mind (reuse classes/patterns rather
than adding new systems):

### Existing, reuse as-is where possible
- Web: header + mobile nav (no auth buttons!) + footer — `apps/web/+layout.svelte`
- Admin: `AppSidebar` (248px, rose-stem active indicator) — `apps/admin/src/lib/components/AppSidebar.svelte`; topbar avatar ("Signed in as"), stat cards, task tiles — `apps/admin/routes/admin/+layout.svelte`, `+page.svelte`
- Registration filter bar + search + drilldown + tables — `apps/admin/routes/admin/registrations/+page.svelte`
- Event form + dynamic field editor — `apps/admin/routes/admin/events/{new,[id]/edit}/+page.svelte`
- Login card — `apps/admin/routes/login/+page.svelte`

### New UI to build (following the same recipes)
- Any remaining public-web marketing sections (hero art, props, how-it-works,
  CTA band) if not finished, plus event listings/cards/detail per
  `DESIGN_TOKENS.md` component anatomy.

## 7. Conventions (non-negotiable)

- **Svelte 5 runes**: `let { data } = $props()`, `$derived` for computed,
  `{@render children()}` in layouts. Use `$app/state` (`page.url`) — not the
  legacy `$page` store — in new code (matches `AppSidebar.svelte`).
- Scoped styles; shared pieces go in the root layout's `:global()` block;
  **CSS variables only** (no hardcoded colors/shadows in component styles).
- Interactive elements: real `<a>`/`<button>` semantics, visible
  `:focus-visible`, hover + `:active` feedback, `.sr-only` for icon-only
  labels, `aria-current="page"` for active nav.
- Dates: show in local `en-PH` style with `Asia/Manila` timezone and nouns
  like "EDT"-free ("7:00 PM • Wed, Oct 7"). Keep consistent across web/admmin.
- Copy is warm, plain, no jargon, short sentences (see homepage for tone).

## 8. Verify before calling it done

- `bun run build` passes for both apps (a Vercel-adapter symlink warning on
  Windows is expected/harmless).
- No auth UI in web. Registration succeeds with zero session. Admin routes
  bounce unauthenticated users to login.
- Status badges color-match `DESIGN_TOKENS.md`; every interactive element
  has a focus ring; reduced-motion respected.
- Match `TESTING.md` checklist and `WORKFLOW.md` Definition of Done.

Do not reintroduce removed web auth, do not commit secrets, and route all
new schema through Drizzle migrations.