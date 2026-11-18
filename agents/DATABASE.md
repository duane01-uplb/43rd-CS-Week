# Database

## Core Tables

### events
- id, title, description, start_at, end_at, capacity, status, created_at
- All events are free — no fee/payment fields.

### profiles
- id, full_name, role (participant | admin), created_at
- Auth-created profiles share their ID with the Supabase Auth user. The
  anonymous registration profile is seeded independently of Auth.

### registrations
- id, event_id (fk), user_id (fk), status (pending | confirmed | cancelled), created_at
- `user_id` always references `ANONYMOUS_USER_ID` for web submissions — the
  public site has no accounts. One fixed `profiles` row ("Anonymous") is
  seeded by `drizzle/0003_*` using the ID in `packages/db/src/anonymous.ts`.
- Per-user duplicate protection (`event_user_unique`) is a partial unique
  index on `(event_id, user_id)` that excludes `ANONYMOUS_USER_ID`, so
  anonymous submissions are not all treated as one submitter. Anonymous
  submissions have no de-duplication (no identity).

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
- Path convention: `{auth.uid()}/{event_id}/{timestamp}-{name}` became
	`{ANONYMOUS_USER_ID}/{event_id}/{timestamp}-{random}-{name}` for web
	submissions (uploaded server-side with the service-role key). Admin-only
	reads via signed URLs validated against the `{uuid}/` prefix — see
	AUTHORIZATION.md.

## Relationships
- events 1—N registrations
- profiles 1—N registrations (practically all N share the single
  `ANONYMOUS_USER_ID` row for web submissions; other profiles exist for
  admin users)

## Indexes (added 2026-08-28, migration `0002_*`)
- `events_status_start_at_idx (status, start_at)` — public "open &
	upcoming" homepage/events query: `WHERE status='open' AND
	start_at>=now() ORDER BY start_at`.
- `registrations_status_created_at_idx (status, created_at)` — admin
	registration list/export: filter by status, order by created_at.
- The partial `event_user_unique` index covers registrations with individual
  profiles. Anonymous registrations are outside that index.
- Admin event and participant search uses a case-insensitive substring match
  across titles, profile names, and configured name responses.

## Migration Strategy
- Schema defined in `schema.ts` (Drizzle, TypeScript) — source of truth
	for table structure.
- Apply the versioned migrations in `packages/db/drizzle/` with
  `bun run drizzle-kit migrate` from `packages/db`. The config uses the target
  database's `DIRECT_URL`. Check the migration journal on an existing
  database before running it. A schema pushed without the journal needs
  its actual schema and data changes reconciled before a versioned upgrade.
- Prior raw SQL migrations (0001_init.sql, 0002_remove_payments.sql,
	0003_add_dynamic_registration_fields.sql) are superseded by the Drizzle
	baseline schema — see DECISIONS.md (2026-08-16, Drizzle transition).
- After the Drizzle migrations, apply the Supabase SQL from the SQL editor
  in this order on a fresh project:

  1. `20260821_enable_rls.sql`
  2. `20260825_handle_new_user_trigger.sql`
  3. `20260825_registration_uploads_storage.sql`
  4. `20261118_enforce_backend_access.sql`

  The two August 25 files share a version prefix and are tracked by filename
  in this manual workflow. For a project with the three August files
  already applied, apply the November access migration only. It expects
  the original policies to be present.
