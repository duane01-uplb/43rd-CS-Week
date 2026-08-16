# Feature: Registration

## Summary
Participants register for events. All events are free (payments descoped — see DECISIONS.md).

## Requirements
- One registration per user per event (duplicate prevention)
- Registration status: pending → confirmed
- Confirmation email on success
 - Registration form fields are dynamic per event, sourced from `event_registration_fields` (no hardcoded per-event forms)
 - Required-field validation happens both client-side and server-side against the field definitions

## Dependencies
- events (must exist, must be open for registration)

## Edge Cases
- Event at capacity
- Event closed/expired
- Duplicate submission (double-click, retry)
- User already registered
