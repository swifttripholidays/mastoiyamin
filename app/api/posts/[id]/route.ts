import { deletePost, updatePost } from '@/lib/content-db';
import { requireOwnerApi } from '@/lib/owner-auth';

function cleanSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90);
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireOwnerApi();
  if ('error' in auth) return auth.error;
  const { id } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;
  const title = String(body.title ?? '').trim();
  const content = String(body.content ?? '').trim();
  const slug = cleanSlug(String(body.slug || title));
  if (title.length < 3 || content.length < 10 || !slug) {
    return Response.json({ error: 'Add a title and a little more content.' }, { status: 400 });
  }
  try {
    await updatePost(id, {
      title,
      slug,
      excerpt: String(body.excerpt || content.slice(0, 160)).trim(),
      content,
      category: String(body.category || 'Perspective').slice(0, 40),
      status: body.status === 'published' ? 'published' : 'draft',
      featured: Boolean(body.featured),
      coverUrl: body.coverUrl ? String(body.coverUrl) : null,
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'The post could not be updated.' }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireOwnerApi();
  if ('error' in auth) return auth.error;
  const { id } = await context.params;
  await deletePost(id);
  return Response.json({ ok: true });
}
