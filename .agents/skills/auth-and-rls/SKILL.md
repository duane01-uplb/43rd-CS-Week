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
1. **Supabase RLS policies** — source of truth, enforced at database level
2. **Route-level guards** — Next.js middleware or layout-level checks, redirect unauthorized
3. **Server-side role check** — on all admin API routes and server actions

Never rely on client-side checks alone.

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

### RLS Policy Pattern
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

### Protected Routes
- Use SvelteKit `hooks.server.ts` for global session/role checks or layout-level server `load` functions for route-scoped protection.
- Redirect to login if not authenticated; for admin routes implement a server `load` that throws a redirect when role checks fail.

## Required RLS Policies (per AUTHORIZATION.md)
| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| events | Public | Admin | Admin | Admin |
| registrations | Own rows + Admin all | Own | — | — |
| profiles | Own row | Auto (signup) | Own row | — |

## Common Mistakes
- **Missing profile creation** on sign-up — user exists in `auth.users` but has no `profiles` row
- **Client-only auth checks** — always enforce at RLS level first
- **Forgetting `auth.uid()`** in RLS policies — this is how Supabase knows the current user
- **Admin role check via client** — always verify role server-side, never trust client claims
- **Session not refreshed** — handle token refresh for long-lived sessions

## Validation Checklist
- [ ] Sign-up creates both `auth.users` entry and `profiles` row
- [ ] Login/logout works, session persists across page navigation
- [ ] Unauthorized users are redirected from protected routes
- [ ] Non-admin users cannot access `/admin/*`
- [ ] RLS policies prevent data access at the database level (test with Supabase SQL editor)
- [ ] `agents/AUTHORIZATION.md` is updated with any new policies
- [ ] Migration created for any new RLS policies (see `supabase-migrations` skill)
