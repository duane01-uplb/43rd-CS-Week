---
name: supabase-migrations
description: How to safely create, test, and deploy Supabase database migrations for the CS Week website.
---

# Supabase Migrations

## When to Use
- Adding or altering tables, columns, constraints, or indexes
- Adding or modifying RLS policies
- Seeding data that must persist across environments

## Before You Start
1. Read [`agents/DATABASE.md`](../../agents/DATABASE.md) for current schema and relationships
2. Read [`agents/DECISIONS.md`](../../agents/DECISIONS.md) for any schema-related decisions
3. Check existing migrations in `supabase/migrations/` for naming convention and sequence
4. Confirm the change is required by the current sprint's tasks (see `plans/cs-week-website-plan.md`)

## Workflow

### 1. Create the Migration File
```bash
# Use sequential numbering matching existing convention
# Format: NNNN_description.sql
# Example: 0003_add_rls_policies.sql
```
Place in `supabase/migrations/`.

### 2. Write the SQL
- Use `IF NOT EXISTS` / `IF EXISTS` guards where appropriate
- Include `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` when creating new tables
- Add comments explaining the "why" for non-obvious changes
- Reference the agents doc that motivated the change (e.g., `-- See AUTHORIZATION.md`)

### 3. Test Locally
```bash
supabase db reset    # Replays all migrations from scratch
```
Verify:
- Migration applies without errors
- Schema matches what `agents/DATABASE.md` documents
- Existing data (if any) is not corrupted

### 4. Update Documentation
- Update `agents/DATABASE.md` if schema changed
- Update `agents/AUTHORIZATION.md` if RLS policies changed
- Append to `agents/DECISIONS.md` if this reflects a design decision

### 5. Deploy to Staging
```bash
supabase db push     # Push to linked Supabase project
```
Verify on staging before merging to main.

## Common Mistakes
- **Forgetting RLS:** Every new table must have `ENABLE ROW LEVEL SECURITY`
- **Missing `CASCADE`:** Foreign keys to `auth.users` should use `ON DELETE CASCADE`
- **Payment columns:** Payments are descoped — do not add fee/payment fields (see DECISIONS.md)
- **Manual dashboard edits:** Never edit production schema via the Supabase dashboard — always use migrations

## Validation Checklist
- [ ] Migration file follows naming convention (`NNNN_description.sql`)
- [ ] SQL applies cleanly on `supabase db reset`
- [ ] `agents/DATABASE.md` updated if schema changed
- [ ] `agents/AUTHORIZATION.md` updated if RLS policies changed
- [ ] No payment/fee-related columns introduced
- [ ] Tested on staging before production
