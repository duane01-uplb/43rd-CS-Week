# Testing

## Approach
Solo project — manual testing is primary, prioritized by risk (auth, data integrity).

## Per-Sprint Testing
Each sprint's Definition of Done includes a staging smoke test (see WORKFLOW.md).

## Critical Path Checklist (used in final regression sprint)
- [ ] Public pages load without redirecting or requiring a session
- [ ] No login/signup/logout links remain anywhere in the public site
- [ ] Browse events, open event detail
- [ ] Register for an event (success)
- [ ] Admin: sign in at `/login`, then create, edit, and close an event
- [ ] Admin: view registrations, export CSV
- [ ] Unauthorized user blocked from /admin
- [ ] Mobile responsiveness across core pages

## Backend preview smoke test

Use the public and admin previews for the same commit on `backend/polish`.
Confirm their database and Storage configuration points to the staging
Supabase project before applying SQL or submitting test data. Follow the
migration order in [DATABASE.md](DATABASE.md).

- [ ] In a signed-out session, the default listing shows open events.
  The all-status view includes closed events and excludes drafts.
  Open and closed details load, and draft detail returns 404.
- [ ] A temporary staging event with one seat accepts one of two concurrent
  anonymous signups. Closing the event blocks further signups.
- [ ] Invalid answers and unsupported uploads fail before confirmation. A
  valid proof upload is visible through the admin's five-minute signed link.
- [ ] Signed-out users and participant accounts cannot access admin routes,
  registration export, or proof-file signing.
- [ ] The registrations table and CSV produce the same rows for combined
  participant search and status filters. Formula-like values export as text.
- [ ] Admin create and edit preserve the scheduled Manila time when the
  preview server runs in UTC.

## File Upload / Dynamic Fields (added 2026-08-25; updated 2026-08-29 for anonymous flow)
Manual QA for the three seeded events (Career Orientation, Warframes/"Web Design",
Games Day) — fields come from `packages/db/scripts/seed-registration-fields.mjs`:
- [ ] Career Orientation: consent select is required and fields render in sort order
- [ ] Warframes: proof_of_payment rejects non-image files and files > 4 MB with a clear error
- [ ] Warframes: successful upload stores only the storage path in `responses`
	(check `registrations.responses` jsonb — must be `{ANONYMOUS_USER_ID}/...`, no binary)
- [ ] Failed registration (missing required field / at capacity) does NOT leave orphaned uploads in storage
- [ ] Registration succeeds with NO session/cookies — anonymous submission is the intended path
- [ ] Non-admin cannot open `/admin/registrations/file?path=...` (403/redirect)
- [ ] Admin sees "View uploaded image" link; signed URL opens the image and expires (~5 min)
- [ ] Optional-by-design fields (SHS track/strand, college fields, Warframes members 2–3,
	Games Day reserve) can be left blank and registration still succeeds

## Tooling (optional, add if adopted)
- Playwright for smoke tests
