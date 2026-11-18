# Feature: Registration

## Summary
Participants register for events. All events are free (payments descoped — see DECISIONS.md).

## Requirements
- Public registrations are anonymous and share a single profile. The form
  confirms successful signups immediately. Duplicate protection applies to
  legacy registrations linked to individual accounts.
- Registration form fields come from `event_registration_fields`.
  The browser checks required inputs and the server validates submitted
  answers against the field definitions.
- Every registration-enabled event carries a required `data_privacy_consent` select at sort_order 0 with the exact RA 10173 consent copy (pinned in the seed script — do not paraphrase)

## Events with registration forms
Only three events take registrations right now; their fields are seeded via
`packages/db/scripts/seed-registration-fields.mjs` (idempotent, run with bun):
1. **Career Orientation** — includes SHS track/strand and college degree/classification/student-number fields. These are seeded optional: conditional show/hide + conditional validation are deliberately out of scope for launch (see DECISIONS.md 2026-08-25).
2. **Warframes** (organizer form label "Web Design") — team of 1–3, members 2–3 optional (same conditional-logic deferral), plus a **required file upload**: proof-of-payment image.
3. **Games Day** — fixed team size (5 + optional reserve), all fields flat required/optional as seeded.

## File uploads (`field_type = 'file'`)
- Scope: manual-payment evidence only (bank/GCash QR screenshot). NOT payment processing — payments remain descoped (DECISIONS.md).
- The private `registration-uploads` bucket uses the
  `{ANONYMOUS_USER_ID}/{event_id}/{timestamp}-{random}-{filename}` path.
- The server checks the upload MIME type against the bucket allowlist
  (PNG, JPEG, WebP, HEIC, and HEIF) and enforces a 4 MB per-file limit.
  Uploads start after answer validation and the initial capacity check.
- `registrations.responses[field_key]` stores the storage path string, never raw bytes.
- Admin dashboard renders file responses as signed-URL links (`/admin/registrations/file`, admin-only, 5-minute expiry) backed by the "admins read uploads" storage policy.

## Dependencies
- events (must exist, must be open for registration)
- Supabase Storage bucket `registration-uploads` (see supabase/migrations/20260825_registration_uploads_storage.sql)

## Edge Cases
- Event at capacity
- Event closed
- Repeated anonymous submissions can each occupy a seat
- Unsupported MIME types and oversized files are rejected before upload.
  If a submission fails after uploads start, the server attempts cleanup.
