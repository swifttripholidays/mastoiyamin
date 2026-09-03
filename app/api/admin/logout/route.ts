import { clearAdminSession } from '@/lib/admin-session';

export async function GET(request: Request) {
  await clearAdminSession();
  return Response.redirect(new URL('/', request.url));
}
