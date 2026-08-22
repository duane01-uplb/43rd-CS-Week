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

