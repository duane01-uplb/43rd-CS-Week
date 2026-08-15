---
name: drizzle-migrations
description: How to safely create, test, and deploy Drizzle schema changes for the CS Week website.
---

# Drizzle Migrations

## When to Use
- Adding or altering tables, columns, or constraints in `schema.ts`
- Any schema change (RLS policy changes are a separate, manual Supabase SQL step — see below)

## Before You Start
1. Read `agents/DATABASE.md` for current schema
2. Read `agents/DECISIONS.md` for schema-related decisions
3. Edit `schema.ts` directly — this is the source of truth, not hand-written SQL

## Workflow
1. Edit `schema.ts`
2. `npx drizzle-kit generate` — generates a migration file in `drizzle/`
3. Review the generated SQL before applying
4. `npx drizzle-kit push` (or `migrate`) to apply
5. Update `agents/DATABASE.md` to reflect the change
6. Append to `agents/DECISIONS.md` if this reflects a design decision

## RLS Policies (manual, not Drizzle-managed)
Drizzle does not manage RLS policies. If a policy needs to change, write
and apply raw SQL directly via Supabase SQL editor or a one-off `.sql`
file, and document the change in `agents/AUTHORIZATION.md`. Remember: RLS
is defense-in-depth only — the real enforcement is application-level (see
AUTHORIZATION.md Enforcement Layers).

## Common Mistakes
- Editing the DB schema directly in the Supabase dashboard instead of
  `schema.ts` — causes drift between Drizzle's view of the schema and
  reality
- Forgetting that Drizzle bypasses RLS — every query needs an explicit
  app-level auth check
- Payment columns: still descoped, do not reintroduce

## Validation Checklist
- [ ] `schema.ts` updated
- [ ] `drizzle-kit generate` produces a clean, reviewed migration
- [ ] Migration applied and tested locally
- [ ] `agents/DATABASE.md` updated
- [ ] `agents/AUTHORIZATION.md` updated if access rules changed
