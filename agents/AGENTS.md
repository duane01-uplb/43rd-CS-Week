# Agents Directory — Index

This directory is the single source of truth for the CS Week Website project.
Each file owns one concern. Update the relevant file when a decision changes —
do not duplicate information across files.

| File | Owns |
|---|---|
| PROJECT.md | Goals, scope, stakeholders, timeline |
| ARCHITECTURE.md | Stack, folder structure, environments |
| DATABASE.md | Schema, migrations, relationships |
| AUTHORIZATION.md | Roles, RLS policies, protected routes |
| API.md | Endpoints, request/response contracts |
| PAYMENTS.md | Out of scope — kept for history, see DECISIONS.md |
| TESTING.md | Test strategy, manual QA checklists |
| UI.md | Design tokens, layout conventions, component list |
| WORKFLOW.md | Sprint cadence, Definition of Done, guardrails |
| DECISIONS.md | Log of key decisions and why they were made |
| features/*.md | Per-feature spec: registration, events, admin |

Reference: sprint plan lives in `plans/cs-week-website-plan.md`.

Note: project-specific AI skills live under `.agents/skills/` (examples: `auth-and-rls`, `event-registration-flow`, `supabase-migrations`). Use those SKILL.md documents for repeatable agent workflows and repository-specific rules.
