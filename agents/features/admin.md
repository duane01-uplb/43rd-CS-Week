# Feature: Admin

## Summary
Admin dashboard for organizers to manage events and view registrations/payments.

## Requirements
- Role-gated `/admin` route
- Event CRUD (create/edit/close, set fee/free, set capacity)
- Registration table: search, filter, view payment status
- CSV export

## Dependencies
- authorization (admin role enforcement)
- events, registrations, payments (read/write)

## Edge Cases
- Non-admin attempting access
- Editing an event with existing registrations
- Closing an event with pending payments
