-- =============================================================================
-- Registration uploads storage (proof-of-payment images)
-- Applied: 2026-08-25
-- Context: Warframes ("Web Design") registration requires an upload of the
--          QR/transaction screenshot after manual payment (bank/GCash).
--          This is NOT payment processing — payments remain descoped
--          (see DECISIONS.md); the file is manual-payment evidence only.
--
-- Bucket: registration-uploads (PRIVATE)
-- Path convention used by apps/web:
--   {auth.uid()}/{event_id}/{timestamp}-{sanitized-filename}
-- Policies below enforce that layout at the DB layer (defense-in-depth;
-- primary enforcement remains app-level per AUTHORIZATION.md).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Bucket (private)
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'registration-uploads',
  'registration-uploads',
  false,
  4194304, -- 4 MB (app limit must stay under Vercel's ~4.5 MB request-body cap)
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- storage.objects policies
-- ---------------------------------------------------------------------------

-- Authenticated users may upload ONLY into their own top-level folder.
DROP POLICY IF EXISTS "users insert own uploads" ON storage.objects;
CREATE POLICY "users insert own uploads" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'registration-uploads'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

-- Admins may view/download any upload (used to review proof of payment).
-- Regular participants get no SELECT policy — they cannot read files back,
-- not even their own (app never renders them outside the admin dashboard).
DROP POLICY IF EXISTS "admins read uploads" ON storage.objects;
CREATE POLICY "admins read uploads" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'registration-uploads'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid()) AND role = 'admin'
    )
  );

-- Deliberately NO UPDATE / DELETE policies: uploads are immutable once
-- submitted (paths are timestamped, so retries create new objects instead
-- of upserting). Cleanup of orphans is an admin/dashboard concern, not a
-- client capability.
