# Decisions Log

| Date | Decision | Reason |
|---|---|---|
| 2026-08-15 | Stack: Next.js + Supabase + Vercel | Fast integrated auth/db for solo dev |
| 2026-08-15 | Payments: PayMongo | PH-native, supports GCash/cards |
| 2026-08-15 | Mixed registration model (free + paid per event) | Different events have different fee requirements |
| 2026-08-15 | UI/UX embedded into feature tasks, no separate design phase | Solo dev, AI-assisted implementation |

| 2026-08-15 | Payments/PayMongo dropped from scope | Simplifies build; all events are free registration only |
Add new rows as decisions are made — do not delete history, only append.

| 2026-08-15 | Frontend framework: Svelte / SvelteKit (replaces Next.js) | The frontend was rebuilt on Svelte/SvelteKit; `next-scaffold/` is intentionally abandoned and kept for history only |

| 2026-08-16 | Per-event registration fields via `event_registration_fields` + `registrations.responses` jsonb (not fixed columns) | Organizer requirements not yet finalized per event; avoids migration-per-event |
