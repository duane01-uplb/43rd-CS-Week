# Feature: Payments

## Summary
Paid registration flow via PayMongo for events with a fee.

## Requirements
- Checkout session creation
- Webhook handling (signature-verified, idempotent)
- Payment status linked to registration status
- Receipt email on confirmed payment

## Dependencies
- registrations (payment attaches to a registration)
- PayMongo sandbox/account access confirmed in Sprint 0

## Edge Cases
- Failed payment
- Abandoned checkout
- Duplicate webhook delivery
- Webhook received before/after registration record exists
