# Database

## Core Tables

### events
- id, title, description, start_at, end_at, capacity, status, created_at
- All events are free — no fee/payment fields.

### profiles
- id (fk auth.users), full_name, role (participant | admin), created_at

### registrations
- id, event_id (fk), user_id (fk), status (pending | confirmed | cancelled), created_at

### event_registration_fields
- id, event_id (fk), field_key, label, field_type (text|number|email|select|checkbox|file), options (jsonb, nullable), is_required, sort_order
- Defines the custom questions an organizer needs for their event's registration form.
- `field_key` must be unique per event (`event_field_unique`).
- `is_required` is a flat boolean — no conditional/dependent-field support
	(see DECISIONS.md 2026-08-25).

### registrations (updated)
- Add: responses (jsonb) — participant's answers keyed by field_key, validated against event_registration_fields at submit time.
- `file`-type answers store the Supabase Storage object path (string), never the raw file.

## Storage
- Bucket `registration-uploads` (private, images only, 4 MB limit) — proof-of-payment
	uploads for Warframes ("Web Design"). Manual payments only; NOT payment processing
	(see DECISIONS.md 2026-08-25).
- Path convention: `{auth.uid()}/{event_id}/{timestamp}-{filename}`; enforced at the DB
	layer via storage.objects policies (see supabase/migrations/20260825_registration_uploads_storage.sql
	and AUTHORIZATION.md).

## Relationships
- events 1—N registrations
- profiles 1—N registrations

## Migration Strategy
- Schema defined in `schema.ts` (Drizzle, TypeScript) — source of truth
	for table structure.
- Migrations generated via `drizzle-kit generate`, applied via
	`drizzle-kit push` (or `migrate`, per team preference).
- Prior raw SQL migrations (0001_init.sql, 0002_remove_payments.sql,
	0003_add_dynamic_registration_fields.sql) are superseded by the Drizzle
	baseline schema — see DECISIONS.md (2026-08-16, Drizzle transition).
- The `handle_new_user` trigger on `auth.users` is NOT managed by Drizzle
	(Supabase's `auth` schema is out of Drizzle's scope) — applied once
	manually via Supabase SQL editor.
