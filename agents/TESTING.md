# Testing

## Approach
Solo project — manual testing is primary, prioritized by risk (auth, payments, data integrity).

## Per-Sprint Testing
Each sprint's Definition of Done includes a staging smoke test (see WORKFLOW.md).

## Critical Path Checklist (used in Sprint 7 regression)
- [ ] Sign up / login / logout
- [ ] Browse events, open event detail
- [ ] Register for free event (success + duplicate prevention)
- [ ] Register for paid event (success, failure, abandoned checkout)
- [ ] Webhook duplicate delivery does not double-process
- [ ] Admin: create/edit/close event
- [ ] Admin: view registrations, export CSV
- [ ] Unauthorized user blocked from /admin
- [ ] Mobile responsiveness across core pages

## Tooling (optional, add if adopted)
- Playwright for smoke tests
- Manual sandbox testing for PayMongo
