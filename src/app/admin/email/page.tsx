import { AdminPageAuthenticator } from '@/infrastructure/auth/AdminPageAuthenticator';
import { AdminLayout } from '@/presentation/admin/components/AdminLayout';
import EmailSettingsContent from '@/presentation/admin/components/EmailSettingsContent';

// Force dynamic rendering to prevent static generation during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function EmailSettingsPage(): Promise<React.ReactElement> {
  const authenticator = new AdminPageAuthenticator();
  await authenticator.authenticate();

  return (
    <AdminLayout>
      <EmailSettingsContent />
    </AdminLayout>
  );
}
