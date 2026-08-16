# Authorization

## Roles
- `participant` (default)
- `admin`

## Access Rules
- Public: homepage, events listing, event detail (read-only)
- Authenticated only: registration submission, profile
- Admin only: `/admin/*`, event CRUD, registration visibility

## Enforcement Layers
1. **Application-level checks (source of truth)** — every server-side
	Drizzle query (SvelteKit `load` functions, form actions, admin routes)
	must verify `locals.session` and, for admin operations, `profiles.role`
	before executing. Drizzle bypasses RLS, so this layer is not optional.

Use the shared `requireSession()` / `requireAdmin()` helpers (see
`src/lib/server/auth-guards.ts` in each app) rather than ad-hoc inline
checks — centralizes the one place this logic must be correct.
2. Route-level guards in SvelteKit (`hooks.server.ts`, layout `load`)
	redirect unauthorized users before a page even attempts a query.
3. Supabase RLS policies — retained as defense-in-depth (protects against
	any future direct Supabase client usage or dashboard access) but is
	NOT the primary enforcement mechanism for app traffic, since Drizzle
	connects with elevated Postgres privileges.

## RLS Policy Notes (fill in as implemented)
- events: public SELECT; INSERT/UPDATE/DELETE admin-only
- registrations: user can SELECT/INSERT own rows; admin can SELECT all
