BEGIN;

CREATE SCHEMA IF NOT EXISTS private;

-- Read only the caller's role, without re-entering the profiles policies.
CREATE OR REPLACE FUNCTION private.csweek_current_profile_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE id = (SELECT auth.uid());
$$;

REVOKE ALL ON FUNCTION private.csweek_current_profile_role() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.csweek_current_profile_role() TO authenticated;

ALTER POLICY "users read own profile" ON public.profiles
  USING (
    id = (SELECT auth.uid())
    OR (SELECT private.csweek_current_profile_role()) = 'admin'
  );

ALTER POLICY "users update own profile, role locked" ON public.profiles
  WITH CHECK (
    id = (SELECT auth.uid())
    AND role = (SELECT private.csweek_current_profile_role())
  );

DROP POLICY IF EXISTS "users insert own registrations" ON public.registrations;

ALTER POLICY "public can read events" ON public.events
  USING (status IN ('open', 'closed'));

ALTER POLICY "public can read registration fields" ON public.event_registration_fields
  USING (EXISTS (
    SELECT 1 FROM public.events
    WHERE events.id = event_registration_fields.event_id
      AND events.status IN ('open', 'closed')
  ));

COMMIT;
