# Feature: Registration

## Summary
Participants register for events. All events are free (payments descoped — see DECISIONS.md).

## Requirements
- One registration per user per event (duplicate prevention)
- Registration status: pending → confirmed
- Confirmation email on success

## Dependencies
- events (must exist, must be open for registration)

## Edge Cases
- Event at capacity
- Event closed/expired
- Duplicate submission (double-click, retry)
- User already registered
