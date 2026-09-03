import { head } from '@vercel/blob';

export async function GET(_request: Request, context: { params: Promise<{ key: string }> }) {
  const { key } = await context.params;
  if (!/^[a-z0-9-]+\.[a-z0-9]+$/i.test(key)) return new Response('Not found', { status: 404 });

  try {
    const blob = await head(key);
    return Response.redirect(blob.url, 307);
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
