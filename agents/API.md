# API

## Conventions
 - Prefer SvelteKit form actions (`+page.server.ts` actions) for form-driven mutations when possible.
 - Use SvelteKit endpoints (`src/routes/api/*/+server.ts`) for plain HTTP JSON endpoints or webhook handlers.

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
