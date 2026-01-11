import { AdminPageAuthenticator } from '@/infrastructure/auth/AdminPageAuthenticator';
import { AdminLayout } from '@/presentation/admin/components/AdminLayout';
import { AppointmentsPageContent } from '@/presentation/admin/components/appointment/AppointmentsPageContent';

// Force dynamic rendering to prevent static generation during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function AppointmentsPage() {
  const authenticator = new AdminPageAuthenticator();
  await authenticator.authenticate();

  return (
    <AdminLayout>
      <AppointmentsPageContent />
    </AdminLayout>
  );
}
