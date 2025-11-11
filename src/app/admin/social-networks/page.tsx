import { AdminPageAuthenticatorator } from '@/infrastructure/auth/AdminPageAuthenticatorator';
import { AdminLayout } from '@/presentation/admin/components/AdminLayout';
import SocialNetworksForm from '@/presentation/admin/components/SocialNetworksForm';

// Force dynamic rendering to prevent static generation during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function SocialNetworksPage() {
  const authenticator = new AdminPageAuthenticatorator();
  await authenticator.authenticate();

  return (
    <AdminLayout>
      <SocialNetworksForm />
    </AdminLayout>
  );
}
