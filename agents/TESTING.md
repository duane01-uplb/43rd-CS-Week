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

## Tooling (optional, add if adopted)
- Playwright for smoke tests
