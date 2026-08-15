# API

## Conventions
- Prefer Next.js Server Actions for internal mutations where possible
- Use Route Handlers (`/app/api/*`) for anything needing a plain HTTP endpoint

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
