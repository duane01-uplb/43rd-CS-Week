-- =============================================================================
-- Restore handle_new_user trigger on auth.users
-- Applied: 2026-08-25
-- Context: DATABASE.md documents this trigger as a one-time manual apply
--          (auth schema is out of Drizzle's scope). It was lost when the
--          Supabase project ref changed on 2026-08-16 (see PROGRESS.md) and
--          never re-applied — found missing during 2026-08-25 registration
--          flow QA: signups created auth.users rows without matching
--          profiles rows, so every registration insert failed its
--          user_id FK constraint.
-- Idempotent: safe to re-run.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''),
    'participant'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
