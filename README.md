# 43rd CS Week Website

The official website for the 43rd CS Week. Showcases all events (flagship + others) and lets participants register. All events are free registration.

## Stack

- **Framework:** SvelteKit + TypeScript
- **Backend/DB:** Supabase (Postgres, Auth, Storage)
- **Styling:** Tailwind CSS
- **Hosting:** Vercel
- **Package Manager:** Bun

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Bun](https://bun.sh/)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/duane01-uplb/43rd-CS-Week.git
   cd 43rd-CS-Week
   ```

2. **Install dependencies** (run per app)
   ```bash
   cd apps/web && bun install
   cd ../admin && bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env .env.local # or create a local .env file from your secret store
   ```
   Fill in your Supabase project URL and keys. SvelteKit exposes public environment variables prefixed with `PUBLIC_` (e.g. `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`). Do NOT commit secrets to source control.

4. **Run the development server**
   ```bash
   bun run dev
   ```

5. **Open** [http://localhost:5173](http://localhost:5173)

## Project Structure

```
apps/
   web/              # Public-facing SvelteKit app (homepage, events, registration, auth)
    src/
      routes/       # SvelteKit file-based routing: +page.svelte, +page.server.ts
      lib/          # Utilities, Supabase client, shared components
  admin/            # Admin-facing SvelteKit app (event CRUD, registrations)
    src/
      routes/
      lib/
        components/
        domains/
supabase/           # Migrations and seed data
agents/             # AI-agent project documentation
.agents/            # AI workflow skills
next-scaffold/      # Abandoned Next.js scaffold — history only, not in use
```

See [`agents/ARCHITECTURE.md`](agents/ARCHITECTURE.md) for full architecture details.

## Documentation

| Document | Purpose |
|----------|---------|
| [`cs-week-website-plan.md`](cs-week-website-plan.md) | Sprint plan (canonical) |
| [`agents/AGENTS.md`](agents/AGENTS.md) | Documentation index |
| [`agents/ARCHITECTURE.md`](agents/ARCHITECTURE.md) | Stack and folder structure |
| [`agents/DATABASE.md`](agents/DATABASE.md) | Schema and migrations |
| [`agents/DECISIONS.md`](agents/DECISIONS.md) | Decision log |
| [`agents/WORKFLOW.md`](agents/WORKFLOW.md) | Sprint cadence and guardrails |

## License

Private — CS Week organizer use only.