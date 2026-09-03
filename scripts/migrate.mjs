import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.NEON_DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is required. Connect a Neon database to run migrations.');
  process.exit(1);
}

const sql = neon(connectionString);
const migration = await readFile(new URL('../drizzle/0000_vercel_portfolio.sql', import.meta.url), 'utf8');
const statements = migration
  .split(';')
  .map((statement) => statement.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(`${statement};`);
}

console.log(`Applied ${statements.length} database statements.`);
