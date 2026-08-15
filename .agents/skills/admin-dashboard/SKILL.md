---
name: admin-dashboard
description: Building the admin dashboard for event and registration management (Sprint 4).
---

# Admin Dashboard

## When to Use
- Sprint 4: Admin dashboard implementation
- Any time admin CRUD or role-gated routes are being built or modified

## Before You Start
1. Read [`agents/features/admin.md`](../../agents/features/admin.md) for requirements and edge cases
2. Read [`agents/AUTHORIZATION.md`](../../agents/AUTHORIZATION.md) for role enforcement
3. Read [`agents/API.md`](../../agents/API.md) for admin endpoints
4. Read [`agents/DATABASE.md`](../../agents/DATABASE.md) for schema
5. Verify auth and RLS policies are in place (Sprint 1 dependency)

## Architecture

### Route Structure
```
src/routes/admin/
  +layout.svelte        # Admin layout with role gate (server load or hooks check)
  +page.svelte          # Dashboard overview
  events/
    +page.svelte        # Event list (admin view)
    new/+page.svelte    # Create event
    [id]/edit/+page.svelte # Edit event
  registrations/
    +page.svelte        # Registration table
```

### Access Control (3 layers)
1. **RLS policies** — admin-only INSERT/UPDATE/DELETE on events; admin SELECT all on registrations
2. **Layout guard** — use `src/routes/admin/+layout.server.ts` or a `hooks.server.ts` check to verify session + role, redirect non-admins
3. **Server action/route handler** — verify `profiles.role = 'admin'` before every mutation

## Workflow

### Event CRUD
1. **Create:** Form → server action → insert into `events` → redirect to event list
2. **Edit:** Pre-populate form → server action → update `events` row
3. **Close:** Set `status = 'closed'` — consider impact on existing registrations
4. **Set capacity:** Integer field, validate > 0

### Registration Management
1. **Table view:** Query all registrations with joined event + user data
2. **Search/filter:** By event, by status, by user name
3. **CSV export:**
   ```
   Event, Participant Name, Email, Registration Status, Date
   ```
   Use a route handler (`GET /api/admin/registrations/export`) that returns CSV with proper `Content-Type` header.

### Edge Cases (from agents/features/admin.md)
- **Non-admin attempting access:** Redirect to home, do not reveal admin UI
- **Editing event with registrations:** Warn if reducing capacity below current registration count
- **Closing event with pending registrations:** Define behavior (confirm all? notify?)

## Common Mistakes
- **Client-side only role check:** Always verify admin role server-side via `profiles` table
- **Missing RLS:** Even with route guards, RLS must independently prevent non-admin mutations
- **Exposing admin endpoints:** `/api/admin/*` routes must check auth + role before any operation
- **Large CSV exports:** For many registrations, stream the CSV rather than loading all into memory
- **Payment columns in CSV:** Do not include payment-related fields — payments are descoped

## Validation Checklist
- [ ] Non-admin users cannot access `/admin/*` (redirect works)
- [ ] Non-admin users cannot call admin API endpoints (returns 403)
- [ ] Admin can create a new event with all required fields
- [ ] Admin can edit an existing event
- [ ] Admin can close an event
- [ ] Admin can view all registrations across events
- [ ] Search/filter works on registration table
- [ ] CSV export produces valid, usable data
- [ ] RLS independently blocks non-admin mutations (test via Supabase SQL editor)
- [ ] `agents/API.md` is updated with any new endpoints
