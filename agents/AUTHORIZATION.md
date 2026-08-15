# Authorization

## Roles
- `participant` (default)
- `admin`

## Access Rules
- Public: homepage, events listing, event detail (read-only)
- Authenticated only: registration submission, profile
- Admin only: `/admin/*`, event CRUD, registration visibility

## Enforcement Layers
1. Supabase RLS policies (source of truth — never rely on client-side checks alone)
2. Route-level guards in Next.js (redirect unauthorized users)
3. Server-side role check on all admin API/server actions

## RLS Policy Notes (fill in as implemented)
- events: public SELECT; INSERT/UPDATE/DELETE admin-only
- registrations: user can SELECT/INSERT own rows; admin can SELECT all
