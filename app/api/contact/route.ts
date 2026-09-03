import { createMessage } from '@/lib/content-db';

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const message = String(body.message ?? '').trim();
  const honeypot = String(body.company ?? '').trim();
  if (honeypot) return Response.json({ ok: true });
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10 || message.length > 3000) {
    return Response.json({ error: 'Please complete every field with a valid message.' }, { status: 400 });
  }
  try {
    await createMessage({ name, email, message });
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: 'Message storage is not ready yet. Please use a social link.' }, { status: 503 });
  }
}
