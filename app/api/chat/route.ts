import { addVisitorChatMessage, getVisitorConversation } from '@/lib/content-db';

function clean(value: unknown, max: number) {
  return String(value ?? '').trim().slice(0, max);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = clean(url.searchParams.get('sessionId'), 80);
  const token = clean(url.searchParams.get('token'), 160);
  if (!sessionId || !token) return Response.json({ error: 'Conversation credentials are missing.' }, { status: 400 });
  const conversation = await getVisitorConversation(sessionId, token).catch(() => null);
  return conversation
    ? Response.json(conversation)
    : Response.json({ error: 'Conversation not found.' }, { status: 404 });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const sessionId = clean(body.sessionId, 80);
  const token = clean(body.token, 160);
  const message = clean(body.message, 1200);
  if (!sessionId || !token || message.length < 1) return Response.json({ error: 'Write a message first.' }, { status: 400 });
  const conversation = await addVisitorChatMessage(sessionId, token, message).catch(() => null);
  return conversation
    ? Response.json(conversation, { status: 201 })
    : Response.json({ error: 'Conversation not found.' }, { status: 404 });
}
