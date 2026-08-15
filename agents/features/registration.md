# Feature: Registration

## Summary
Participants register for events, free or paid depending on the event.

## Requirements
- One registration per user per event (duplicate prevention)
- Registration status: pending → confirmed (free) or pending → paid/failed (paid)
- Confirmation email on success

## Dependencies
- events (must exist, must be open for registration)
- payments (only for paid events — see payments.md)

## Edge Cases
- Event at capacity
- Event closed/expired
- Duplicate submission (double-click, retry)
- User already registered
