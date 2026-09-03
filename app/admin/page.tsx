import { redirect } from 'next/navigation';
import { AdminStudio } from '@/components/admin-studio';
import { AdminLock } from '@/components/admin-lock';
import { hasAdminSession } from '@/lib/admin-session';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!(await hasAdminSession())) return <AdminLock displayName="Owner" />;
  return <AdminStudio displayName="Yamin Mastoi" signOutPath="/api/admin/logout" />;
}
