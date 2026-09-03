import { createPost, listPosts } from '@/lib/content-db';
import { requireOwnerApi } from '@/lib/owner-auth';

function cleanSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90);
}

export async function GET(request: Request) {
  const includeDrafts = new URL(request.url).searchParams.get('all') === '1';
  if (includeDrafts) {
    const auth = await requireOwnerApi();
    if ('error' in auth) return auth.error;
  }
  try {
    return Response.json(await listPosts(includeDrafts));
  } catch {
    return Response.json([]);
  }
}

export async function POST(request: Request) {
  const auth = await requireOwnerApi();
  if ('error' in auth) return auth.error;
  const body = (await request.json()) as Record<string, unknown>;
  const title = String(body.title ?? '').trim();
  const content = String(body.content ?? '').trim();
  const excerpt = String(body.excerpt ?? '').trim();
  const slug = cleanSlug(String(body.slug || title));
  if (title.length < 3 || content.length < 10 || !slug) {
    return Response.json({ error: 'Add a title and a little more content.' }, { status: 400 });
  }
  try {
    const result = await createPost({
      title,
      slug,
      excerpt: excerpt || content.slice(0, 160),
      content,
      category: String(body.category || 'Perspective').slice(0, 40),
      status: body.status === 'published' ? 'published' : 'draft',
      featured: Boolean(body.featured),
      coverUrl: body.coverUrl ? String(body.coverUrl) : null,
    });
    return Response.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error && error.message.includes('UNIQUE')
      ? 'That post URL is already in use.'
      : 'The post could not be saved.';
    return Response.json({ error: message }, { status: 400 });
  }
}
