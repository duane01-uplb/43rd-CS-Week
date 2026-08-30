# Authorization

## Roles
- `participant` (default; the single `ANONYMOUS_USER_ID` profile used for
  all public web registrations)
- `admin` (has a profile + Supabase auth user, logs into the admin console)

## Access Rules
- Public (anonymous): homepage, events listing, event detail (read-only),
  registration submission
- Auth required: admin console only — `requireSession()` + `requireAdmin()`
  gate `/admin/*`, event CRUD, and registration visibility

## Enforcement Layers
1. **Application-level checks (source of truth)** — every server-side
	Drizzle query in the admin app (SvelteKit `load` functions, form
	actions, admin routes) must verify `locals.user` and, for admin
	operations, `profiles.role`, before executing. Drizzle bypasses RLS,
	so this layer is not optional. The public web app has no session —
	registration is anonymous by design and needs no guard.

Use the shared `requireSession()` / `requireAdmin()` helpers (see
`src/lib/server/auth-guards.ts` in `apps/admin`) rather than ad-hoc
inline checks — centralizes the one place this logic must be correct.
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
- **registrations**: user can SELECT own rows or admin can SELECT all
  (only admin rows are meaningful now — web registrations share the
  anonymous identity); no public INSERT; admin-only UPDATE; no DELETE
  policy (deletes disallowed). Web registration inserts through Drizzle
  (app-level), not the client.
- **profiles**: user can SELECT own row or admin can SELECT all; user
  can UPDATE own row but `role` is locked to its current value in the
  `WITH CHECK` clause (cannot self-promote to admin); INSERT handled by
  `handle_new_user` trigger only, no client INSERT policy
- **event_registration_fields**: public SELECT; admin-only ALL

## Storage (registration-uploads bucket)
Implemented 2026-08-25 via `supabase/migrations/20260825_registration_uploads_storage.sql`.
Private bucket holding proof-of-payment images for Warframes ("Web Design").
Defense-in-depth only — the registration action enforces image type/size and
path layout at the application level.

**Changed 2026-08-29:** the public web app no longer has user sessions, so
registrant uploads are written server-side with `SUPABASE_SERVICE_ROLE_KEY`
(service role bypasses RLS). The old `authenticated` INSERT policy (pinned to
`auth.uid()`) no longer matches these writes. Paths use the fixed
`{ANONYMOUS_USER_ID}/{event_id}/{timestamp}-{random}-{name}` layout so the
admin file endpoint's `{uuid}/` prefix guard still applies unchanged. Policies
remain as a backstop for any future direct client use.

- **INSERT** (`authenticated`): only into the caller's own top-level folder —
  `(storage.foldername(name))[1] = auth.uid()`; legacy path for accounts, now
  superseded by service-role uploads
- **SELECT** (`authenticated`): admins only (`profiles.role = 'admin'`); regular
  users cannot read files back, not even their own
- **UPDATE / DELETE**: no policies — uploads are immutable once submitted
  (paths are timestamped, so retries create new objects, never upserts)
- Admin dashboard serves file responses through `/admin/registrations/file`,
  which requires `requireAdmin()`, validates the path prefix, and redirects to
  a short-lived (5 min) signed URL minted with the signed-in admin's session
