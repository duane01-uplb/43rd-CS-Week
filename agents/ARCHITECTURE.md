# Architecture

## Stack
- Framework: **Svelte / SvelteKit** (corrected — see note below)
- Backend/DB: Supabase (Postgres, Auth, Storage)
- Hosting: Vercel

> **Correction note:** This document originally specified Next.js (App Router). The project was scaffolded with Next.js first (`next-scaffold/`), but the frontend was rebuilt on Svelte/SvelteKit. `next-scaffold/` is abandoned — see `DECISIONS.md`. Svelte/SvelteKit is the current and only frontend framework in use.

## Environments
- Local (dev)
- Staging (Vercel preview / staging project)
- Production

## Folder Structure (actual — reflects live repo)
```
/apps
  /admin                     # Admin-facing Svelte application
    /src
      /lib
        /components          # Shared/reusable Svelte components
          /registrations     # Feature-scoped component group
          AdminShellHeader.svelte
          AppSidebar.svelte
          RegistrationCard.svelte
          RegistrationDetailDialog.svelte
          RegistrationSummaryCard.svelte
          admin-navigation.ts
        /domains              # Business-logic / data-model layer
        /registration-detail  # Feature module (view + logic bundle)
        /utils                 # Shared generic helpers
      /routes                  # SvelteKit file-based routing
/supabase                      # migrations, seed data
```

### Conventions
- Global/shell components sit flat in `components/` (e.g. `AdminShellHeader.svelte`); feature-specific components are grouped into subfolders (e.g. `registrations/`).
- Non-component logic tightly coupled to a component (e.g. `admin-navigation.ts`) stays alongside it in `components/`, rather than moving to `utils/`.
- `domains/` holds business logic and data shape, decoupled from Supabase calls made directly in components.
- `utils/` is for generic helpers only — feature-specific logic belongs in `domains/` or a feature folder like `registration-detail/`.
- `routes/` follows SvelteKit conventions (`+page.svelte`, `+page.server.ts`, `+layout.svelte`, etc.).

### Open items to verify
- [ ] Whether `apps/` will contain additional applications beyond `admin` (e.g. a public-facing registration site), confirming the monorepo shape is intentional long-term.
- [ ] Exact location of the Supabase client/auth setup within `lib/`.

## Payments
Not implemented. All registrations are free (see DECISIONS.md).

## Deployment
- Push to `main` → Vercel prod
- Push to feature branch → Vercel preview (staging validation)
