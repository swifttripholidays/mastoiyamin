import { getAdminConversation, replyToChat, setChatStatus, type ChatStatus } from '@/lib/content-db';
import { requireOwnerApi } from '@/lib/owner-auth';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireOwnerApi();
  if ('error' in auth) return auth.error;
  const { id } = await context.params;
  const conversation = await getAdminConversation(id);
  return conversation ? Response.json(conversation) : Response.json({ error: 'Conversation not found.' }, { status: 404 });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireOwnerApi();
  if ('error' in auth) return auth.error;
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const message = String(body.message ?? '').trim().slice(0, 1600);
  if (!message) return Response.json({ error: 'Write a reply first.' }, { status: 400 });
  return Response.json(await replyToChat(id, message), { status: 201 });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireOwnerApi();
  if ('error' in auth) return auth.error;
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const status = String(body.status ?? '') as ChatStatus;
  if (!['ai', 'human', 'closed'].includes(status)) return Response.json({ error: 'Invalid status.' }, { status: 400 });
  return Response.json(await setChatStatus(id, status));
}
