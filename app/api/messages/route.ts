import { listMessages } from '@/lib/content-db';
import { requireOwnerApi } from '@/lib/owner-auth';

export async function GET() {
  const auth = await requireOwnerApi();
  if ('error' in auth) return auth.error;
  return Response.json(await listMessages());
}
