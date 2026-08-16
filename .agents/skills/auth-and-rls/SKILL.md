---
name: auth-and-rls
description: Implementing Supabase Auth flows and Row Level Security policies for the CS Week website.
---

# Auth & RLS

## When to Use
- Setting up or modifying Supabase Auth (sign-up, login, logout, session handling)
- Creating or updating RLS policies
- Adding protected routes or role-based access
- Sprint 1 (auth foundation) and Sprint 5 (hardening/review)

## Before You Start
1. Read [`agents/AUTHORIZATION.md`](../../agents/AUTHORIZATION.md) for roles and access rules
2. Read [`agents/DATABASE.md`](../../agents/DATABASE.md) for table structure
3. Read [`agents/ARCHITECTURE.md`](../../agents/ARCHITECTURE.md) for route structure
4. Check the sprint plan for auth-related tasks in the current sprint

## Architecture

### Roles
- `participant` (default) — can browse events, register
- `admin` — full access to `/admin/*`, event CRUD, registration management

### Enforcement Layers (defense in depth)
1. **Application-level checks** — every server-side Drizzle query must verify
  the session and role before querying. Drizzle bypasses RLS, so these
  checks are the source of truth for authorization in the app.
2. **Route-level guards** — SvelteKit `hooks.server.ts` or layout-level
  `load` functions that redirect unauthorized users before a page attempts
  a query.
3. **Supabase RLS policies** — retained as defense-in-depth only.

Use `requireSession()` / `requireAdmin()` from `src/lib/server/auth-guards.ts`
in each app instead of writing ad-hoc checks inline — these helpers
centralize the required enforcement logic.

## Workflow

### Auth Setup
1. **Supabase client** — use `lib/supabase/` for client/server helpers
2. **Sign-up flow:**
   - Create auth user via `supabase.auth.signUp()`
   - Auto-create `profiles` row (via trigger or post-signup insert)
   - Default role: `participant`
3. **Login flow:** `supabase.auth.signInWithPassword()`
4. **Logout:** `supabase.auth.signOut()`
5. **Session handling:** Use `supabase.auth.getSession()` server-side, middleware for route protection

### RLS Policy Pattern (defense-in-depth only — not the primary check)
```sql
-- Example: Users can read their own registrations
CREATE POLICY "users can view own registrations"
  ON registrations FOR SELECT
  USING (auth.uid() = user_id);

-- Example: Admin can read all registrations
CREATE POLICY "admins can view all registrations"
  ON registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

These policies stay applied (raw SQL, not Drizzle-managed — see
`.agents/skills/drizzle-migrations/SKILL.md`), but since Drizzle's
Postgres connection bypasses RLS, the actual enforcement for app traffic
is the app-level check pattern below.

### App-Level Check Pattern (actual enforcement)

```ts
// Example: +page.server.ts load function
export const load = async ({ locals }) => {
  if (!locals.session) throw redirect(303, '/login');
  const myRegistrations = await db
    .select()
    .from(registrations)
    .where(eq(registrations.userId, locals.session.user.id));
  return { myRegistrations };
};

// Example: admin-only check
export const load = async ({ locals }) => {
  if (!locals.session) throw redirect(303, '/login');
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, locals.session.user.id),
  });
  if (profile?.role !== 'admin') throw redirect(303, '/');
  // ... admin query
};
```
### Protected Routes
- Use SvelteKit `hooks.server.ts` for global session/role checks or layout-level server `load` functions for route-scoped protection.
- Redirect to login if not authenticated; for admin routes implement a server `load` that throws a redirect when role checks fail.

## Required Access Rules (per AUTHORIZATION.md — enforced in app code, mirrored in RLS as defense-in-depth)
| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| events | Public | Admin | Admin | Admin |
| registrations | Own rows + Admin all | Own | Admin only | — |
| profiles | Own row + Admin all | Auto (trigger, signup) | Own row (role field must NOT be client-editable — see DECISIONS.md) | — |

## Common Mistakes
- **Missing profile creation** on sign-up — user exists in `auth.users` but has no `profiles` row
- **Relying on RLS for app traffic** — Drizzle bypasses RLS; app-level session/role checks are required
- **Forgetting to centralize checks** — write `requireSession()` / `requireAdmin()` helpers and reuse them
- **Admin role check via client** — always verify role server-side, never trust client claims
- **Session not refreshed** — handle token refresh for long-lived sessions

## Validation Checklist
- [ ] Every Drizzle query in a `load` function or form action has an explicit session check, and role check where admin-only
- [ ] RLS policies still exist as defense-in-depth (test with Supabase SQL editor) but are not relied on as the primary check
- [ ] `agents/AUTHORIZATION.md` is updated with any new access rules
- [ ] Schema change (if any) made via Drizzle (see `drizzle-migrations` skill); RLS policy change (if any) applied as manual raw SQL
