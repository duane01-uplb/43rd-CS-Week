import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export * from './schema';

export function createDb(databaseUrl: string) {
  // Options tuned for Supabase's transaction pooler on serverless (Vercel):
  //  - `prepare: false` is REQUIRED with Drizzle against the transaction
  //    pooler (port 6543). Named prepared statements can't be shared across
  //    pooled sessions and cause "prepared statement already exists" errors.
  //  - `max: 1` keeps the per-instance connection count low so many
  //    serverless function instances don't exhaust the Supabase connection
  //    budget (each replica multiplies the total).
  const client = postgres(databaseUrl, { prepare: false, max: 1 });
  return drizzle(client, { schema });
}

export type Database = ReturnType<typeof createDb>;
