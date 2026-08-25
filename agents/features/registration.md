# Feature: Registration

## Summary
Participants register for events. All events are free (payments descoped — see DECISIONS.md).

## Requirements
- One registration per user per event (duplicate prevention)
- Registration status: pending → confirmed
- Confirmation email on success
  - Registration form fields are dynamic per event, sourced from `event_registration_fields` (no hardcoded per-event forms)
  - Required-field validation happens both client-side and server-side against the field definitions
- Every registration-enabled event carries a required `data_privacy_consent` select at sort_order 0 with the exact RA 10173 consent copy (pinned in the seed script — do not paraphrase)

## Events with registration forms
Only three events take registrations right now; their fields are seeded via
`packages/db/scripts/seed-registration-fields.mjs` (idempotent, run with bun):
1. **Career Orientation** — includes SHS track/strand and college degree/classification/student-number fields. These are seeded optional: conditional show/hide + conditional validation are deliberately out of scope for launch (see DECISIONS.md 2026-08-25).
2. **Warframes** (organizer form label "Web Design") — team of 1–3, members 2–3 optional (same conditional-logic deferral), plus a **required file upload**: proof-of-payment image.
3. **Games Day** — fixed team size (5 + optional reserve), all fields flat required/optional as seeded.

## File uploads (`field_type = 'file'`)
- Scope: manual-payment evidence only (bank/GCash QR screenshot). NOT payment processing — payments remain descoped (DECISIONS.md).
- Private bucket `registration-uploads`; path convention `{auth.uid()}/{event_id}/{timestamp}-{filename}`.
- Server action accepts images only (PNG/JPG/WebP/HEIC per bucket allowlist), ≤ 4 MB (Vercel request-body cap); uploads happen only after duplicate/capacity checks pass.
- `registrations.responses[field_key]` stores the storage path string, never raw bytes.
- Admin dashboard renders file responses as signed-URL links (`/admin/registrations/file`, admin-only, 5-minute expiry) backed by the "admins read uploads" storage policy.

## Dependencies
- events (must exist, must be open for registration)
- Supabase Storage bucket `registration-uploads` (see supabase/migrations/20260825_registration_uploads_storage.sql)

## Edge Cases
- Event at capacity
- Event closed/expired
- Duplicate submission (double-click, retry)
- User already registered
- Upload fails or non-image submitted → registration is rejected, nothing stored
