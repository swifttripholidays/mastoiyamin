import { hasAdminSession } from '@/lib/admin-session';

export async function requireOwnerApi() {
  if (!(await hasAdminSession())) {
    return { error: new Response('Owner authentication required', { status: 401 }) };
  }
  return { user: { displayName: 'Owner' } };
}
