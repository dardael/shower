import { AdminPageAuthenticator } from '@/infrastructure/auth/AdminPageAuthenticator';
import { AdminLayout } from '@/presentation/admin/components/AdminLayout';
import { ScheduledRestartForm } from '@/presentation/admin/components/ScheduledRestartForm';
import { BackupConfigurationForm } from '@/presentation/admin/components/BackupConfigurationForm';

// Force dynamic rendering to prevent static generation during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function MaintenancePage() {
  const authenticator = new AdminPageAuthenticator();
  await authenticator.authenticate();

  return (
    <AdminLayout>
      <ScheduledRestartForm />
      <BackupConfigurationForm />
    </AdminLayout>
  );
}
