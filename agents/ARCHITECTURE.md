# Architecture

## Stack
- Framework: Next.js (App Router)
- Backend/DB: Supabase (Postgres, Auth, Storage)
- Hosting: Vercel
- Payments: PayMongo

## Environments
- Local (dev)
- Staging (Vercel preview / staging project)
- Production

## Folder Structure (proposed — adjust as repo grows)
```
/app
  /(public)        # homepage, events, event detail
  /(auth)          # sign-up, login
  /admin           # protected admin routes
  /api             # route handlers (webhooks, server actions if needed)
/lib               # supabase client, paymongo client, utils
/components        # shared UI components
/supabase          # migrations, seed data
```

## Deployment
- Push to `main` → Vercel prod
- Push to feature branch → Vercel preview (staging validation)
