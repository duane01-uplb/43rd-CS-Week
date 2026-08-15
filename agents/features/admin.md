# Feature: Admin

## Summary
Admin dashboard for organizers to manage events and view registrations.

## Requirements
- Role-gated `/admin` route
- Event CRUD (create/edit/close, set capacity)
- Registration table: search, filter
- CSV export

## Dependencies
- authorization (admin role enforcement)
- events, registrations (read/write)

## Edge Cases
- Non-admin attempting access
- Editing an event with existing registrations
