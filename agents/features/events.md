# Feature: Events

## Summary
Public listing and detail pages for all CS Week events, including the flagship event.

## Requirements
- List all events (filterable by status/date)
- Event detail: description, schedule, fee/free status, capacity
- Flagship event highlighted on homepage

## Sprint 1 Event Roster (flagship + others)
- Code Wars
- Career Orientation
- Job Fair
- Warframes
- Games Day

Note: exact registration field requirements pending per-organizer input. See registration.md and DECISIONS.md for the dynamic-fields approach.

## Dependencies
- None (read-only, public)

## Edge Cases
- No events available (empty state)
- Event not found / invalid id
- Timezone display consistency
