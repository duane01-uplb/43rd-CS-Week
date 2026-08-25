# Testing

## Approach
Solo project — manual testing is primary, prioritized by risk (auth, data integrity).

## Per-Sprint Testing
Each sprint's Definition of Done includes a staging smoke test (see WORKFLOW.md).

## Critical Path Checklist (used in final regression sprint)
- [ ] Sign up / login / logout
- [ ] Browse events, open event detail
- [ ] Register for an event (success + duplicate prevention)
- [ ] Admin: create/edit/close event
- [ ] Admin: view registrations, export CSV
- [ ] Unauthorized user blocked from /admin
- [ ] Mobile responsiveness across core pages

## File Upload / Dynamic Fields (added 2026-08-25)
Manual QA for the three seeded events (Career Orientation, Warframes/"Web Design",
Games Day) — fields come from `packages/db/scripts/seed-registration-fields.mjs`:
- [ ] Career Orientation: consent select required; all 11 fields render in sort order
- [ ] Warframes: proof_of_payment rejects non-image files and files > 4 MB with a clear error
- [ ] Warframes: successful upload stores only the storage path in `responses`
	(check `registrations.responses` jsonb — must be `{auth.uid()}/...`, no binary)
- [ ] Failed/duplicate registration does NOT leave orphaned uploads in storage
- [ ] Non-admin cannot open `/admin/registrations/file?path=...` (403/redirect)
- [ ] Admin sees "View uploaded image" link; signed URL opens the image and expires (~5 min)
- [ ] Optional-by-design fields (SHS track/strand, college fields, Warframes members 2–3,
	Games Day reserve) can be left blank and registration still succeeds

## Tooling (optional, add if adopted)
- Playwright for smoke tests
