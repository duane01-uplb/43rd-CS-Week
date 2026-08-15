---
name: deployment
description: Pre-deploy checklist and staging-to-production workflow for the CS Week website on Vercel.
---

# Deployment

## When to Use
- Deploying to staging or production
- Sprint 6 (QA, soft launch, go-live)
- Any time a production configuration change is needed

## Before You Start
1. Read [`agents/ARCHITECTURE.md`](../../agents/ARCHITECTURE.md) for environment setup
2. Read [`agents/WORKFLOW.md`](../../agents/WORKFLOW.md) for before-production checklist
3. Read `cs-week-website-plan.md` Sprint 6 tasks
4. Verify all prior sprint DoDs are met

## Environments

| Environment | Trigger | URL |
|-------------|---------|-----|
| Local | `npm run dev` (or `bun run dev`) | `http://localhost:3000` |
| Staging | Push to feature branch → Vercel preview | Vercel preview URL |
| Production | Push to `main` → Vercel auto-deploy | Production URL |

## Staging Deployment Workflow

1. **Push to feature branch**
   ```bash
   git push origin feature/sprint-N-description
   ```
2. **Vercel creates preview deployment automatically**
3. **Smoke test on preview URL:**
   - [ ] Pages load without errors
   - [ ] Auth flow works (sign-up, login, logout)
   - [ ] Database connectivity (events load from Supabase)
   - [ ] No console errors
4. **If passing → merge to main**

## Production Deployment Checklist

### Pre-Deploy
- [ ] All sprint DoD items met
- [ ] Staging smoke test passes
- [ ] Environment variables verified in Vercel dashboard:
  - `PUBLIC_SUPABASE_URL` (client-visible)
  - `PUBLIC_SUPABASE_ANON_KEY` (client-visible)
  - `SUPABASE_SERVICE_ROLE_KEY` (server-side only — do not expose)
  - `PUBLIC_SITE_URL`
- [ ] No secrets in source control (check `.gitignore`)
- [ ] Database migrations applied to production Supabase
- [ ] RLS policies verified on production
- [ ] Build passes locally: `npm run build` (or `bun run build`)

### Deploy
```bash
git checkout main
git merge staging-branch
git push origin main
# Vercel auto-deploys
```

### Post-Deploy
- [ ] Production URL loads correctly
- [ ] Core user journey tested from clean browser:
  1. Visit homepage
  2. Browse events
  3. Sign up / log in
  4. Register for an event
  5. Admin: view registrations
- [ ] Check Vercel deployment logs for errors
- [ ] Check Supabase logs for query errors or RLS violations
- [ ] Monitor for 5–10 minutes after deploy

### Rollback
If critical issues are found:
1. **Vercel:** Redeploy previous deployment from Vercel dashboard (instant)
2. **Database:** If migration was applied, prepare a rollback migration
3. **Notify:** If users were affected, communicate the issue

## Sprint 6 Specific Tasks

### Soft Launch
1. Deploy to production with final content loaded
2. Share with a small group (3–5 people)
3. Monitor Supabase and Vercel logs during test period
4. Collect feedback and fix launch-blocking issues

### Go-Live
1. Full regression test passes (see `agents/TESTING.md` critical path checklist)
2. Test data removed / closed (`scripts/cleanup.*`)
3. Final event content loaded
4. Production smoke test from multiple devices
5. Go-live

## Common Mistakes
- **Wrong environment variables:** Production pointing to development Supabase project
- **Migrations not applied:** Schema mismatch between app code and production database
- **Test data in production:** Seed/test events visible to real users
- **Missing RLS on production:** Policies not applied via migration
- **No rollback plan:** Always know how to revert before deploying

## Validation Checklist
- [ ] Staging preview deployment works
- [ ] Production deployment works
- [ ] Environment variables are correct for each environment
- [ ] Database schema matches between app and Supabase
- [ ] Core user flows work on production
- [ ] Monitoring is active (Vercel + Supabase dashboards)
- [ ] Rollback path is documented and tested
