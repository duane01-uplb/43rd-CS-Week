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

## RLS Policy Notes
Implemented 2026-08-21 via `supabase/migrations/20260821_enable_rls.sql`.
RLS is enabled on all four public tables. This is defense-in-depth only —
see Enforcement Layers above; app-level `requireSession()`/`requireAdmin()`
checks remain the source of truth since Drizzle bypasses RLS.

- **events**: public SELECT (`anon`, `authenticated`); admin-only ALL
  (INSERT/UPDATE/DELETE) via `profiles.role = 'admin'` check
- **registrations**: user can SELECT own rows or admin can SELECT all;
  user can INSERT own rows only (`user_id = auth.uid()`); admin-only
  UPDATE; no DELETE policy (deletes disallowed)
- **profiles**: user can SELECT own row or admin can SELECT all; user
  can UPDATE own row but `role` is locked to its current value in the
  `WITH CHECK` clause (cannot self-promote to admin); INSERT handled by
  `handle_new_user` trigger only, no client INSERT policy
- **event_registration_fields**: public SELECT; admin-only ALL

## Storage (registration-uploads bucket)
Implemented 2026-08-25 via `supabase/migrations/20260825_registration_uploads_storage.sql`.
Private bucket holding proof-of-payment images for Warframes ("Web Design").
Defense-in-depth only — the registration action enforces image type/size and
path layout at the application level; the policies backstop direct client use.

- **INSERT** (`authenticated`): only into the caller's own top-level folder —
  `(storage.foldername(name))[1] = auth.uid()`; matches the app's
  `{auth.uid()}/{event_id}/{timestamp}-{filename}` path convention
- **SELECT** (`authenticated`): admins only (`profiles.role = 'admin'`); regular
  participants cannot read files back, not even their own
- **UPDATE / DELETE**: no policies — uploads are immutable once submitted
  (paths are timestamped, so retries create new objects, never upserts)
- Admin dashboard serves file responses through `/admin/registrations/file`,
  which requires `requireAdmin()`, validates the path prefix, and redirects to
  a short-lived (5 min) signed URL minted with the signed-in admin's session
