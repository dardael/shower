import { headers } from 'next/headers';
import { auth } from '@/infrastructure/auth/BetterAuthInstance';
import { User } from '@/domain/auth/entities/User';
import {
  AuthServiceLocator,
  SettingsServiceLocator,
} from '@/infrastructure/container';
import { DatabaseConnection } from '@/infrastructure/shared/databaseConnection';
import LoginButton from '@/presentation/shared/components/LoginButton';
import AdminDashboard from '@/presentation/admin/components/AdminDashboard';
import NotAuthorized from '@/presentation/admin/components/NotAuthorized';

export default async function AdminPage() {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session || !session.user?.email) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">
          Sign in to access the Admin Dashboard
        </h1>
        <LoginButton />
      </div>
    );
  }

  const user = new User(session.user.email, true);
  const authorizeAdminAccess = AuthServiceLocator.getAuthorizeAdminAccess();
  const isAuthorized = authorizeAdminAccess.execute(user);

  // Connect to database first to ensure Better Auth can access it
  const dbConnection = DatabaseConnection.getInstance();
  await dbConnection.connect();

  if (isAuthorized) {
    const getWebsiteName = SettingsServiceLocator.getWebsiteName();
    const websiteName = await getWebsiteName.execute();

    return <AdminDashboard initialWebsiteName={websiteName} />;
  } else {
    return <NotAuthorized />;
  }
}
