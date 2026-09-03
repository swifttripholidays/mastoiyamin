import { neon } from '@neondatabase/serverless';

export type QueryRow = Record<string, unknown>;

/**
 * Vercel/Neon integrations have used a few different environment variable
 * names over time. Prefer DATABASE_URL, but accept the common aliases too.
 */
export function getDatabaseUrl() {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.NEON_DATABASE_URL,
  ];

  return candidates.find((value) => typeof value === 'string' && value.trim())?.trim() || '';
}

export function getSql() {
  const connectionString = getDatabaseUrl();
  if (!connectionString) {
    throw new Error(
      'Database is not configured. Add DATABASE_URL (or POSTGRES_URL) to the Vercel project environment variables.',
    );
  }
  return neon(connectionString);
}

const bootstrapStatements = [
  `CREATE TABLE IF NOT EXISTS "posts" (
    "id" text PRIMARY KEY NOT NULL,
    "title" text NOT NULL,
    "slug" text NOT NULL UNIQUE,
    "excerpt" text NOT NULL,
    "content" text NOT NULL,
    "category" text DEFAULT 'Perspective' NOT NULL,
    "status" text DEFAULT 'draft' NOT NULL,
    "featured" boolean DEFAULT false NOT NULL,
    "cover_url" text,
    "created_at" text NOT NULL,
    "updated_at" text NOT NULL,
    "published_at" text
  )`,
  `CREATE TABLE IF NOT EXISTS "messages" (
    "id" text PRIMARY KEY NOT NULL,
    "name" text NOT NULL,
    "email" text NOT NULL,
    "message" text NOT NULL,
    "status" text DEFAULT 'new' NOT NULL,
    "created_at" text NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "media" (
    "id" text PRIMARY KEY NOT NULL,
    "key" text NOT NULL UNIQUE,
    "filename" text NOT NULL,
    "content_type" text NOT NULL,
    "size" integer NOT NULL,
    "created_at" text NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "chat_sessions" (
    "id" text PRIMARY KEY NOT NULL,
    "visitor_name" text NOT NULL,
    "visitor_token" text NOT NULL UNIQUE,
    "status" text DEFAULT 'ai' NOT NULL,
    "created_at" text NOT NULL,
    "updated_at" text NOT NULL,
    "last_message_at" text NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "chat_messages" (
    "id" text PRIMARY KEY NOT NULL,
    "session_id" text NOT NULL,
    "sender" text NOT NULL,
    "body" text NOT NULL,
    "created_at" text NOT NULL,
    CONSTRAINT "chat_messages_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS "posts_status_published_at_idx" ON "posts" ("status", "published_at")`,
  `CREATE INDEX IF NOT EXISTS "chat_sessions_last_message_at_idx" ON "chat_sessions" ("last_message_at")`,
  `CREATE INDEX IF NOT EXISTS "chat_messages_session_id_created_at_idx" ON "chat_messages" ("session_id", "created_at")`,
] as const;

let bootstrapPromise: Promise<void> | null = null;

/**
 * The first database-backed request creates the small schema automatically.
 * This avoids a separate migration step for Vercel previews and fixes the
 * common "relation does not exist" failure after connecting a fresh database.
 */
export async function ensureDatabase() {
  if (!bootstrapPromise) {
    const sql = getSql();
    bootstrapPromise = (async () => {
      for (const statement of bootstrapStatements) {
        await sql.query(`${statement};`);
      }
    })().catch((error) => {
      bootstrapPromise = null;
      throw error;
    });
  }

  await bootstrapPromise;
}
