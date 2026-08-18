# API

## Conventions
 - Prefer SvelteKit form actions (`+page.server.ts` actions) for form-driven mutations when possible.
 - Use SvelteKit endpoints (`src/routes/api/*/+server.ts`) for plain HTTP JSON endpoints or webhook handlers.
 - Prefer SvelteKit form actions (`+page.server.ts` actions) for form-driven mutations when possible.
 - Use SvelteKit endpoints (`src/routes/api/*/+server.ts`) for plain HTTP JSON endpoints or webhook handlers.
 - All data reads/writes (events, registrations, profiles) go through Drizzle. Every action/endpoint handler must check `locals.session` (and role, for admin endpoints) before querying — Drizzle bypasses RLS, so this check is not optional. See `agents/AUTHORIZATION.md`.

## Endpoints (draft — expand as built)

### Public
- `GET /api/events` — list events
- `GET /api/events/:id` — event detail

### Auth-required
- `POST /api/registrations` — create registration
- `GET /api/registrations/me` — participant's own registrations

### Admin
- `POST /api/admin/events` — create event
- `PATCH /api/admin/events/:id` — update event
- `GET /api/admin/registrations` — list/filter registrations
- `GET /api/admin/registrations/export` — CSV export

## Implemented route actions

- `POST /login` and `POST /signup` use SvelteKit form actions with the
  Supabase cookie-backed SSR client.
- `POST /events/:id?/register` creates a registration after a server-side
  session check, field validation, event-status check, duplicate check, and
  capacity check.
- `POST /admin/events/new` is role-gated by `requireAdmin()`.
