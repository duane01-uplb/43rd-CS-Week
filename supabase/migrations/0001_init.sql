-- CS Week Website — initial schema
-- Matches /agents/DATABASE.md. Run via: supabase db push

-- profiles: 1:1 with auth.users, adds role
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'participant' check (role in ('participant', 'admin')),
  created_at timestamptz not null default now()
);

-- events
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  start_at timestamptz not null,
  end_at timestamptz,
  is_paid boolean not null default false,
  fee_amount numeric(10,2),
  capacity integer,
  status text not null default 'draft' check (status in ('draft', 'open', 'closed')),
  created_at timestamptz not null default now()
);

-- registrations
create table registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  unique (event_id, user_id)  -- duplicate-registration prevention
);

-- payments
create table payments (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references registrations(id) on delete cascade,
  amount numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  provider_ref text,
  created_at timestamptz not null default now()
);

-- Enable RLS (policies added in Sprint 1 alongside auth work — see AUTHORIZATION.md)
alter table profiles enable row level security;
alter table events enable row level security;
alter table registrations enable row level security;
alter table payments enable row level security;

-- Minimal read policy so Sprint 0/1 smoke tests can confirm connectivity.
-- Full policy set (admin write, owner-only registration access) lands in Sprint 1.
create policy "events are publicly readable"
  on events for select
  using (true);
