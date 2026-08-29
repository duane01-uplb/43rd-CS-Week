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

## Indexes (added 2026-08-28, migration `0002_*`)
- `events_status_start_at_idx (status, start_at)` — public "open &
	upcoming" homepage/events query: `WHERE status='open' AND
	start_at>=now() ORDER BY start_at`.
- `registrations_status_created_at_idx (status, created_at)` — admin
	registration list/export: filter by status, order by created_at.
- FK lookup keys (`events.id`, `profiles.id`, `registrations.event_id` /
	`user_id`) are already served by PKs and the
	`(event_id, user_id)` unique index's leftmost prefix.
- Note: the admin `ilike profiles.full_name` search is not index-assisted
	(leading wildcard); revisit with `pg_trgm` only if registrations grow.

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
