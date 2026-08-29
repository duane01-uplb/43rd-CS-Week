# Agents Directory — Index

This directory is the single source of truth for the CS Week Website project.
Each file owns one concern. Update the relevant file when a decision changes —
do not duplicate information across files.

| File | Owns |
|---|---|
| PROJECT.md | Goals, scope, stakeholders, timeline |
| ARCHITECTURE.md | Stack, folder structure, environments |
| DATABASE.md | Schema, migrations (Drizzle), relationships |
| AUTHORIZATION.md | Roles, RLS policies, protected routes |
| API.md | Endpoints, request/response contracts |
| PAYMENTS.md | Out of scope — kept for history, see DECISIONS.md |
| TESTING.md | Test strategy, manual QA checklists |
| DESIGN_TOKENS.md | Design system: palette, typography, shape, motion, component anatomy | 
| UI.md | Handoff brief for building the UI (what/where/how, infra match) |
| WORKFLOW.md | Sprint cadence, Definition of Done, guardrails |
| DECISIONS.md | Log of key decisions and why they were made |
| PROGRESS.md | Append-only log of completed work, newest first (companion to DECISIONS.md) |
| features/*.md | Per-feature spec: registration, events, admin |

Reference: sprint plan lives in `plans/cs-week-website-plan.md`.

Note: project-specific AI skills live under `.agents/skills/` (examples: `auth-and-rls`, `event-registration-flow`, `drizzle-migrations`, `admin-dashboard`, `deployment`). Use those SKILL.md documents for repeatable agent workflows and repository-specific rules.

Note: When you complete a task that changes project state (a fix, a
migration, an infra change, a scope change), append an entry to
`agents/PROGRESS.md` summarizing what was done. Do not put progress
content directly in this index file — this file stays index-only.