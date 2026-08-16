---
name: event-registration-flow
description: Building the event browsing and registration features for the CS Week website (Sprints 2-3).
---

# Event & Registration Flow

## When to Use
- Sprint 2: Events listing and detail pages
- Sprint 3: Registration form, validation, capacity checks, confirmation

## Before You Start
1. Read [`agents/features/events.md`](../../agents/features/events.md) for event requirements and edge cases
2. Read [`agents/features/registration.md`](../../agents/features/registration.md) for registration requirements
3. Read [`agents/DATABASE.md`](../../agents/DATABASE.md) for `events` and `registrations` table schema
4. Read [`agents/API.md`](../../agents/API.md) for endpoint contracts
5. Check the sprint plan for current sprint tasks

## Sprint 2: Events

### Pages to Build
1. **Events listing** — `app/(public)/events/page.tsx`
   - Query events from Supabase (status = 'open')
   - Filter by status/date
   - Handle: loading, empty, error states
2. **Event detail** — `app/(public)/events/[id]/page.tsx`
   - Description, schedule, capacity, status
   - Handle: not found, loading, error states

### Data Flow
```
Client → server `load` (server-side) → Drizzle query → Render
```
Use SvelteKit `+page.server.ts` or `+page.ts` `load` functions for initial data fetch. Events listing/detail requires no session check (public read), but still queries via Drizzle, not the Supabase client.

### Test Events
Seed 3–5 realistic test events (Sprint 2 task):
- At least one open, one closed, one at capacity
- Vary dates and descriptions
- Use `scripts/seed.*` or a migration

## Sprint 3: Registration

### Registration Flow
```
User views event → Clicks "Register" → Auth check → Validate → Insert → Confirm
```

### Critical Requirements
1. **Duplicate prevention:** `UNIQUE (event_id, user_id)` constraint in schema handles this at DB level. Also check client-side before submission.
2. **Capacity check:** Before inserting, verify `COUNT(registrations) < event.capacity`. Use a Drizzle transaction (`db.transaction(...)`) for atomicity — Supabase RPC is no longer the pattern since data access moved to Drizzle.
3. **Idempotency:** Repeated submissions for the same user+event should not create duplicates (handled by unique constraint, surface gracefully).

### Form action / Endpoint
Implement registration as a SvelteKit form action (`export const actions = { default: async (event) => { ... } }` in `+page.server.ts`) or as an endpoint (`src/routes/api/registrations/+server.ts`) for API-style calls.

```typescript
// Pseudocode for SvelteKit form action
export const actions = {
   default: async ({ request, locals }) => {
      const form = await request.formData();
      const eventId = form.get('eventId');
      // 1. Verify user via locals/session
      // 2. Check event exists and is open
      // 3. Capacity check (transaction/RPC)
      // 4. Insert registration
      // 5. Send confirmation email
      // 6. return { success: true }
   }
}
```

### Confirmation Email
- Use Supabase Edge Functions or a simple email service
- Content: event name, date/time, confirmation status
- Sprint 3 DoD requires the email to be actually received

## Common Mistakes
- **Race condition on capacity:** Two users registering simultaneously when one slot remains. Use database-level atomicity.
- **Not handling closed events:** Check `event.status` before allowing registration
- **Timezone inconsistency:** Define and document timezone behavior (Sprint 2 task)
- **Missing loading states:** Every data-driven view needs loading, empty, and error states
- **Payment fields:** Do not add any fee/payment fields — all events are free (see DECISIONS.md)

## Validation Checklist

### Events (Sprint 2)
- [ ] Events load from database, not hardcoded
- [ ] Filter by status/date works
- [ ] Event detail page shows all required fields
- [ ] Invalid/missing event shows controlled error
- [ ] Loading and empty states render correctly
- [ ] Timezone behavior is consistent and documented

### Registration (Sprint 3)
- [ ] Logged-in user can register for an event
- [ ] Invalid submissions are rejected with clear error messages
- [ ] Duplicate registration is prevented (unique constraint + graceful UI)
- [ ] Registration blocked when event is at capacity
- [ ] Confirmation email is actually received
- [ ] Database state is correct after registration
- [ ] Repeated requests do not corrupt state
