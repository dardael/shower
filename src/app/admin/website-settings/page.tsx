import { AdminPageAuthenticator } from '@/infrastructure/auth/AdminPageAuthenticator';
import { AdminLayout } from '@/presentation/admin/components/AdminLayout';
import WebsiteSettingsForm from '@/presentation/admin/components/WebsiteSettingsForm';
import { fetchWebsiteName } from '@/infrastructure/shared/layoutUtils';

// Force dynamic rendering to prevent static generation during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function getWebsiteName(): Promise<string> {
  try {
    return await fetchWebsiteName();
  } catch {
    // Return default name if fetch fails
    return 'Website Settings';
  }
}

export default async function WebsiteSettingsPage() {
  const authenticator = new AdminPageAuthenticator();
  await authenticator.authenticate();

  const websiteName = await getWebsiteName();

  return (
    <AdminLayout>
      <WebsiteSettingsForm initialName={websiteName} />
    </AdminLayout>
  );
}
