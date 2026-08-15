Public SvelteKit app (skeleton)

This folder contains a minimal SvelteKit skeleton for the public-facing site.

Setup
1. From `apps/web`, install dependencies:

```bash
npm install
```

2. Set environment variables (see repo root `.env` or CI settings):
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

Run
```bash
npm run dev
```

Notes
- This is a minimal scaffold. Replace with full SvelteKit routing, adapters, and hooks as needed.
