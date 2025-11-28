import { AdminPageAuthenticator } from '@/infrastructure/auth/AdminPageAuthenticator';
import { AdminLayout } from '@/presentation/admin/components/AdminLayout';
import MenuConfigForm from '@/presentation/admin/components/MenuConfigForm';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function MenuConfigPage() {
  const authenticator = new AdminPageAuthenticator();
  await authenticator.authenticate();

  return (
    <AdminLayout>
      <MenuConfigForm />
    </AdminLayout>
  );
}
