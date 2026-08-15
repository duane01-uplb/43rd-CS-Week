import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './apps/web/src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
