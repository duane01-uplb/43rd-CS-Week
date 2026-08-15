# Database

## Core Tables

### events
- id, title, description, start_at, end_at, capacity, status, created_at
- All events are free — no fee/payment fields.

### profiles
- id (fk auth.users), full_name, role (participant | admin), created_at

### registrations
- id, event_id (fk), user_id (fk), status (pending | confirmed | cancelled), created_at

## Relationships
- events 1—N registrations
- profiles 1—N registrations

## Migration Strategy
- All schema changes via Supabase migrations (no manual dashboard edits in prod)
- Migrations committed to `/supabase/migrations`
- 0001_init.sql: initial schema (included a `payments` table + event fee fields)
- 0002_remove_payments.sql: drops `payments` table and event fee fields — payments descoped (see DECISIONS.md)
