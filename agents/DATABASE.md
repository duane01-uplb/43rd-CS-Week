# Database

## Core Tables (draft — finalize in Sprint 0)

### events
- id, title, description, start_at, end_at, is_paid, fee_amount, capacity, status, created_at

### profiles
- id (fk auth.users), full_name, role (participant | admin), created_at

### registrations
- id, event_id (fk), user_id (fk), status (pending | confirmed | cancelled), created_at

### payments
- id, registration_id (fk), amount, status (pending | paid | failed), provider_ref, created_at

## Relationships
- events 1—N registrations
- registrations 1—1 payments (only when event.is_paid = true)
- profiles 1—N registrations

## Migration Strategy
- All schema changes via Supabase migrations (no manual dashboard edits in prod)
- Migrations committed to `/supabase/migrations`
