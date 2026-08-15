-- Dynamic per-event registration fields.
-- See /agents/DECISIONS.md (2026-08-16) and /agents/DATABASE.md.
-- Organizer requirements per event are not yet finalized; this avoids a
-- schema migration every time a new field is requested.
-- Run via: supabase db push

create table event_registration_fields (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  field_key text not null,          -- machine key, e.g. 'discord_username'
  label text not null,              -- shown to participant in the form
  field_type text not null check (field_type in ('text','number','email','select','checkbox')),
  options jsonb,                    -- only used when field_type = 'select'
  is_required boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (event_id, field_key)
);

alter table event_registration_fields enable row level security;

-- Public can read field definitions (needed to render the registration form
-- before the user is authenticated, same pattern as events).
create policy "registration fields are publicly readable"
  on event_registration_fields for select
  using (true);

-- Only admins can define/edit fields.
create policy "admins manage registration fields"
  on event_registration_fields for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Participant answers, keyed by field_key, validated against
-- event_registration_fields at submit time (app-level, not DB-level).
alter table registrations add column responses jsonb not null default '{}';
