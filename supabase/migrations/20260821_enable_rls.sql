-- =============================================================================
-- Enable Row Level Security on all public tables
-- Applied: 2026-08-21
-- Context: Schema snapshot (0000_snapshot.json) showed isRLSEnabled: false on
--          all tables despite docs assuming policies exist. This adds the DB-level
--          backstop. Primary enforcement remains application-level
--          (requireSession / requireAdmin guards in SvelteKit load/actions).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can read events" ON events
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "admins manage events" ON events
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'
  ));

-- ---------------------------------------------------------------------------
-- registrations
-- ---------------------------------------------------------------------------
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own registrations" ON registrations
  FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

CREATE POLICY "users insert own registrations" ON registrations
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "admins update registrations" ON registrations
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
-- No DELETE policy — deletes remain disallowed via RLS.

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own profile" ON profiles
  FOR SELECT TO authenticated
  USING (
    id = (SELECT auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin')
  );

CREATE POLICY "users update own profile, role locked" ON profiles
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (
    id = (SELECT auth.uid())
    AND role = (SELECT role FROM profiles WHERE id = (SELECT auth.uid()))
  );
-- INSERT handled by the handle_new_user trigger (runs as definer) —
-- no client INSERT policy needed.

-- ---------------------------------------------------------------------------
-- event_registration_fields
-- ---------------------------------------------------------------------------
ALTER TABLE event_registration_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can read registration fields" ON event_registration_fields
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "admins manage registration fields" ON event_registration_fields
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
