# Payments

## Provider
PayMongo (GCash/cards, PH-native)
Status: feasibility/sandbox access to be confirmed in Sprint 0.

## Flow
1. Participant registers for a paid event → registration created (status: pending)
2. Checkout session created via PayMongo
3. Participant completes payment on PayMongo-hosted checkout
4. PayMongo sends webhook → verify signature → update payment + registration status
5. Confirmation/receipt email sent only after confirmed payment

## Payment States
`pending` → `paid` | `failed`

## Idempotency
- Webhook handler must be idempotent (duplicate delivery must not double-process)
- Registration should not be marked paid without a verified webhook event

## Open Questions
- Refund policy — not yet defined
- Partial payments / installments — out of scope unless requested
