import { put } from '@vercel/blob';
import { requireOwnerApi } from '@/lib/owner-auth';
import { saveMedia } from '@/lib/content-db';

const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4']);
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
  const auth = await requireOwnerApi();
  if ('error' in auth) return auth.error;

  const data = await request.formData();
  const file = data.get('file');
  if (!(file instanceof File) || !allowed.has(file.type) || file.size > MAX_UPLOAD_BYTES) {
    return Response.json({ error: 'Choose a JPG, PNG, WebP, GIF or MP4 file under 4 MB.' }, { status: 400 });
  }

  const extension = file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'bin';
  const key = `${crypto.randomUUID()}.${extension}`;
  const blob = await put(key, file, { access: 'public', contentType: file.type, addRandomSuffix: false });

  await saveMedia({ key, filename: file.name, contentType: file.type, size: file.size });
  return Response.json({ url: blob.url, key }, { status: 201 });
}
