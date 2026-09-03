import { setAdminSessionCookie, verifyAdminCode } from '@/lib/admin-session';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const code = String(body.code ?? '');
  if (!verifyAdminCode(code)) return Response.json({ error: 'Invalid access code.' }, { status: 403 });
  await setAdminSessionCookie();
  return Response.json({ ok: true });
}
