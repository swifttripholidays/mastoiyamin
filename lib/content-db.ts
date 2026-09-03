import type { JournalPost } from '@/lib/site-data';
import { createConciergeReply } from '@/lib/chat-assistant';
import { ensureDatabase, getSql, type QueryRow } from '@/lib/neon';

export type ChatStatus = 'ai' | 'human' | 'closed';

function asPost(row: QueryRow): JournalPost {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    excerpt: String(row.excerpt),
    content: String(row.content),
    category: String(row.category),
    status: row.status === 'published' ? 'published' : 'draft',
    featured: Boolean(row.featured),
    coverUrl: row.cover_url ? String(row.cover_url) : null,
    publishedAt: String(row.published_at ?? row.updated_at),
  };
}

export async function listPosts(includeDrafts = false) {
  await ensureDatabase();
  const sql = getSql();
  const rows = includeDrafts
    ? await sql`SELECT * FROM posts ORDER BY featured DESC, updated_at DESC`
    : await sql`SELECT * FROM posts WHERE status = 'published' ORDER BY featured DESC, published_at DESC`;
  return rows.map(asPost);
}

export async function getPostBySlug(slug: string) {
  await ensureDatabase();
  const sql = getSql();
  const rows = await sql`SELECT * FROM posts WHERE slug = ${slug} AND status = 'published' LIMIT 1`;
  return rows[0] ? asPost(rows[0]) : null;
}

export async function createPost(input: Omit<JournalPost, 'id' | 'publishedAt'>) {
  await ensureDatabase();
  const sql = getSql();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const publishedAt = input.status === 'published' ? now : null;
  await sql`INSERT INTO posts
    (id, title, slug, excerpt, content, category, status, featured, cover_url, created_at, updated_at, published_at)
    VALUES (${id}, ${input.title}, ${input.slug}, ${input.excerpt}, ${input.content}, ${input.category}, ${input.status}, ${input.featured}, ${input.coverUrl ?? null}, ${now}, ${now}, ${publishedAt})`;
  return { id };
}

export async function updatePost(id: string, input: Omit<JournalPost, 'id' | 'publishedAt'>) {
  await ensureDatabase();
  const sql = getSql();
  const now = new Date().toISOString();
  const existing = await sql`SELECT published_at FROM posts WHERE id = ${id} LIMIT 1`;
  const publishedAt = input.status === 'published' ? String(existing[0]?.published_at ?? now) : null;
  await sql`UPDATE posts SET title = ${input.title}, slug = ${input.slug}, excerpt = ${input.excerpt}, content = ${input.content}, category = ${input.category}, status = ${input.status}, featured = ${input.featured}, cover_url = ${input.coverUrl ?? null}, updated_at = ${now}, published_at = ${publishedAt} WHERE id = ${id}`;
}

export async function deletePost(id: string) {
  await ensureDatabase();
  const sql = getSql();
  await sql`DELETE FROM posts WHERE id = ${id}`;
}

export async function createMessage(input: { name: string; email: string; message: string }) {
  await ensureDatabase();
  const sql = getSql();
  await sql`INSERT INTO messages (id, name, email, message, status, created_at)
    VALUES (${crypto.randomUUID()}, ${input.name}, ${input.email}, ${input.message}, 'new', ${new Date().toISOString()})`;
}

export async function listMessages() {
  await ensureDatabase();
  const sql = getSql();
  return sql`SELECT * FROM messages ORDER BY created_at DESC LIMIT 100`;
}

export async function saveMedia(input: { key: string; filename: string; contentType: string; size: number }) {
  await ensureDatabase();
  const sql = getSql();
  await sql`INSERT INTO media (id, key, filename, content_type, size, created_at)
    VALUES (${crypto.randomUUID()}, ${input.key}, ${input.filename}, ${input.contentType}, ${input.size}, ${new Date().toISOString()})`;
}

function asChatMessage(row: QueryRow) {
  return {
    id: String(row.id),
    sender: String(row.sender) as 'visitor' | 'assistant' | 'owner',
    body: String(row.body),
    created_at: String(row.created_at),
  };
}

export async function createChatSession(name: string) {
  await ensureDatabase();
  const sql = getSql();
  const id = crypto.randomUUID();
  const token = `${crypto.randomUUID()}${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  const welcome = `Welcome, ${name}. I’m the Mastoi AI concierge. Ask me about Yamin’s work, skills or collaborations—and say “talk to Yamin” whenever you want him to join.`;

  await sql`INSERT INTO chat_sessions (id, visitor_name, visitor_token, status, created_at, updated_at, last_message_at)
    VALUES (${id}, ${name}, ${token}, 'ai', ${now}, ${now}, ${now})`;
  await sql`INSERT INTO chat_messages (id, session_id, sender, body, created_at)
    VALUES (${crypto.randomUUID()}, ${id}, 'assistant', ${welcome}, ${now})`;

  return { sessionId: id, token, messages: await listChatMessages(id) };
}

async function findVisitorSession(sessionId: string, token: string) {
  await ensureDatabase();
  const sql = getSql();
  const rows = await sql`SELECT id, visitor_name, status FROM chat_sessions WHERE id = ${sessionId} AND visitor_token = ${token} LIMIT 1`;
  if (!rows[0]) return null;
  return rows[0] as { id: string; visitor_name: string; status: ChatStatus };
}

async function listChatMessages(sessionId: string) {
  await ensureDatabase();
  const sql = getSql();
  const rows = await sql`SELECT id, sender, body, created_at FROM chat_messages WHERE session_id = ${sessionId} ORDER BY created_at ASC LIMIT 300`;
  return rows.map(asChatMessage);
}

export async function getVisitorConversation(sessionId: string, token: string) {
  const session = await findVisitorSession(sessionId, token);
  if (!session) return null;
  return { status: session.status, messages: await listChatMessages(sessionId) };
}

export async function addVisitorChatMessage(sessionId: string, token: string, body: string) {
  await ensureDatabase();
  const sql = getSql();
  const session = await findVisitorSession(sessionId, token);
  if (!session) return null;
  const now = new Date().toISOString();
  let nextStatus: ChatStatus = session.status === 'closed' ? 'human' : session.status;

  await sql`INSERT INTO chat_messages (id, session_id, sender, body, created_at)
    VALUES (${crypto.randomUUID()}, ${sessionId}, 'visitor', ${body}, ${now})`;

  if (session.status === 'ai') {
    const answer = createConciergeReply(body, session.visitor_name);
    if (answer.handoff) nextStatus = 'human';
    await sql`INSERT INTO chat_messages (id, session_id, sender, body, created_at)
      VALUES (${crypto.randomUUID()}, ${sessionId}, 'assistant', ${answer.reply}, ${new Date(Date.now() + 1).toISOString()})`;
  }

  await sql`UPDATE chat_sessions SET status = ${nextStatus}, updated_at = ${now}, last_message_at = ${now} WHERE id = ${sessionId}`;
  return { status: nextStatus, messages: await listChatMessages(sessionId) };
}

export async function listChatSessions() {
  await ensureDatabase();
  const sql = getSql();
  return sql`SELECT s.id, s.visitor_name, s.status, s.created_at, s.updated_at, s.last_message_at,
    (SELECT body FROM chat_messages m WHERE m.session_id = s.id ORDER BY m.created_at DESC LIMIT 1) AS last_message,
    (SELECT COUNT(*) FROM chat_messages m WHERE m.session_id = s.id) AS message_count
    FROM chat_sessions s ORDER BY s.last_message_at DESC LIMIT 100`;
}

export async function getAdminConversation(sessionId: string) {
  await ensureDatabase();
  const sql = getSql();
  const rows = await sql`SELECT id, visitor_name, status, created_at, updated_at, last_message_at FROM chat_sessions WHERE id = ${sessionId} LIMIT 1`;
  if (!rows[0]) return null;
  return { session: rows[0], messages: await listChatMessages(sessionId) };
}

export async function replyToChat(sessionId: string, body: string) {
  await ensureDatabase();
  const sql = getSql();
  const now = new Date().toISOString();
  await sql`INSERT INTO chat_messages (id, session_id, sender, body, created_at)
    VALUES (${crypto.randomUUID()}, ${sessionId}, 'owner', ${body}, ${now})`;
  await sql`UPDATE chat_sessions SET status = 'human', updated_at = ${now}, last_message_at = ${now} WHERE id = ${sessionId}`;
  return getAdminConversation(sessionId);
}

export async function setChatStatus(sessionId: string, status: ChatStatus) {
  await ensureDatabase();
  const sql = getSql();
  await sql`UPDATE chat_sessions SET status = ${status}, updated_at = ${new Date().toISOString()} WHERE id = ${sessionId}`;
  return getAdminConversation(sessionId);
}
