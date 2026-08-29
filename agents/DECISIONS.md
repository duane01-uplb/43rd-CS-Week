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

| 2026-08-16 | Migrated data layer from raw Supabase SQL migrations + supabase-js queries to Drizzle ORM (direct Postgres connection); Supabase retained for Auth/Storage only | Type-safe schema-as-code queries; existing 0001-0003 migrations rewritten as Drizzle baseline |
| 2026-08-16 | RLS demoted to defense-in-depth; application-level session/role checks are now the enforcement source of truth | Drizzle connects via direct Postgres connection and bypasses RLS |
| 2026-08-21 | Enabled RLS on all public tables (events, registrations, profiles, event_registration_fields) via `supabase/migrations/20260821_enable_rls.sql` | Schema snapshot showed `isRLSEnabled: false` on every table despite docs assuming policies existed; adds DB-level backstop per AUTHORIZATION.md enforcement layers. Primary enforcement remains app-level (Drizzle bypasses RLS). |

| 2026-08-25 | Added `file` to the `event_registration_fields.field_type` check constraint and built Supabase Storage-backed uploads (private bucket `registration-uploads`; storage path stored in `responses` jsonb) for proof of payment | Warframes (organizer form label "Web Design") requires a QR/transaction screenshot. **Scope clarification:** teams pay MANUALLY (bank/GCash) and upload payment evidence — this is NOT in-app payment processing, no gateway, no fee columns; it does NOT reverse the payments-descoped decision above |
| 2026-08-25 | Conditional required-field logic deferred: Career Orientation SHS/college fields and Warframes Team Members 2–3 are seeded `is_required = false` even though conditionally required in practice; no show/hide or cross-field validation at launch | `is_required` is a flat boolean with no conditional support; shipping optional-only keeps launch scope tight. Revisit tightening (required-if-X) post-launch if it becomes a data-quality problem |
| 2026-08-25 | Every registration-enabled event gets a required `data_privacy_consent` select as sort_order 0 with exact RA 10173 consent copy from the Web Design Committee | Data Privacy Act of 2012 compliance wording supplied by organizers; must be verbatim, so it is pinned in the seed script (`packages/db/scripts/seed-registration-fields.mjs`) rather than entered ad hoc |

| 2026-08-29 | Removed participant accounts from the public web app; registration is anonymous. Login/signup/logout routes deleted from `apps/web`; admin stays the only sign-in. Registrations insert with a fixed `ANONYMOUS_USER_ID` profile ("Anonymous"); `event_user_unique` became a partial unique index excluding that id (`drizzle/0003_*`) so anonymous submissions aren't all treated as one submitter. File uploads now write via `SUPABASE_SERVICE_ROLE_KEY` server-side using the same `{uuid}/{event_id}/...` path shape | The site is a free, no-accounts-needed event signup; removing participant auth cut the per-request Supabase auth round-trip and account confusion (dashboard/email references). Tradeoff: anonymous registrations have no per-person duplicate prevention and no per-person uploads folder — admin rows show "Anonymous" with the organizer-defined responses as the identity |

