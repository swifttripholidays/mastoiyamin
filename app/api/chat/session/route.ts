import { createChatSession } from '@/lib/content-db';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const name = String(body.name ?? '').trim().slice(0, 60);
  if (name.length < 2) return Response.json({ error: 'Please enter your name.' }, { status: 400 });
  try {
    return Response.json(await createChatSession(name), { status: 201 });
  } catch (error) {
    console.error('chat-session-create-failed', error);
    const isDatabaseError = error instanceof Error && (
      error.message.toLowerCase().includes('database') ||
      error.message.toLowerCase().includes('relation') ||
      error.message.toLowerCase().includes('connect')
    );
    const message = isDatabaseError
      ? 'Chat is not connected to the database yet. Add DATABASE_URL to Vercel and redeploy.'
      : 'The concierge is warming up. Please try again.';
    return Response.json({ error: message }, { status: 503, headers: { 'retry-after': '2' } });
  }
}
