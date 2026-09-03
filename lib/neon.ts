import { neon } from '@neondatabase/serverless';

export type QueryRow = Record<string, unknown>;

export function getSql() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured. Connect a Neon Postgres database to this Vercel project.');
  }
  return neon(connectionString);
}
