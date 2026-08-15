# Workflow

## Cadence
7 weekly sprints + Sprint 0 foundation. One sprint goal each.
Full sprint breakdown: `plans/cs-week-website-plan.md`.

## Definition of Done (per sprint, see plan for sprint-specific items)
- Feature works locally and on staging
- Error/empty/loading states considered
- Authorization/security behavior checked
- DB changes via migrations
- No secrets committed
- Critical flow manually tested

## Guardrails
- Before starting a sprint: goal is achievable in one week, dependencies available
- Before production: staging smoke test passes, env vars verified, rollback path known

## Rule
"Sprint 6 will absorb it" is not permission for unlimited scope creep. Security,
data-integrity, and payment-correctness work is never deferred to hit a date.
