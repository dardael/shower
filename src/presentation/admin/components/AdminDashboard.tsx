import LogoutButton from '@/presentation/shared/components/LogoutButton';
import WebsiteSettingsForm from './WebsiteSettingsForm';

interface AdminDashboardProps {
  initialWebsiteName: string;
}

export default function AdminDashboard({
  initialWebsiteName,
}: AdminDashboardProps) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-4">
        Welcome to the admin area. This page is protected by Google
        authentication.
      </p>
      <div className="mt-8">
        <WebsiteSettingsForm initialName={initialWebsiteName} />
      </div>
      <div className="mt-4">
        <LogoutButton />
      </div>
    </div>
  );
}
