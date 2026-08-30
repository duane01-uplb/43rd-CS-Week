# API

## Conventions
 - Prefer SvelteKit form actions (`+page.server.ts` actions) for form-driven mutations when possible.
 - Use SvelteKit endpoints (`src/routes/api/*/+server.ts`) for plain HTTP JSON endpoints or webhook handlers.
 - All data reads/writes (events, registrations, profiles) go through Drizzle. Every admin action/endpoint handler must check the session/role (via `requireSession()` / `requireAdmin()`) before querying — Drizzle bypasses RLS, so this check is not optional. See `agents/AUTHORIZATION.md`. Public registration is anonymous and needs no session check.

## Endpoints (draft — expand as built)

### Public
- `GET /api/events` — list events
- `GET /api/events/:id` — event detail
- `POST /api/registrations` — create registration (anonymous; no account required)

### Admin
- `POST /api/admin/events` — create event
- `PATCH /api/admin/events/:id` — update event
- `GET /api/admin/registrations` — list/filter registrations
- `GET /api/admin/registrations/export` — CSV export

## Implemented route actions

- `POST /events/:id?/register` creates a registration without a session:
  field/event-status/capacity validation, then an insert pinned to the
  single anonymous identity (`ANONYMOUS_USER_ID`). File answers are
  uploaded to Supabase Storage with the service-role client.
- `POST /admin/login` is the admin-only sign-in via the cookie-backed SSR
  Supabase client.
- `POST /admin/events/new` is role-gated by `requireAdmin()`.
