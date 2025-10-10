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

  // Check for test authentication cookie (only in test environment)
  const cookies = headersList.get('cookie');
  const testSessionToken = cookies?.includes(
    'better-auth.session_token=test-session-token'
  );

  // For testing, if we have the test cookie, create a mock session
  let mockSession = null;
  if (process.env.SHOWER_ENV === 'test' && testSessionToken) {
    const userDataCookie = cookies?.match(/test-user-data=([^;]+)/)?.[1];
    if (userDataCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataCookie));
        mockSession = {
          user: {
            id: `test-user-${userData.email.replace(/[^a-zA-Z0-9]/g, '-')}`,
            email: userData.email,
            name: userData.isAdmin ? 'Test Admin' : 'Test User',
            image: null,
          },
          session: {
            id: 'test-session-id',
            userId: `test-user-${userData.email.replace(/[^a-zA-Z0-9]/g, '-')}`,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        };
      } catch (error) {
        console.error('Failed to parse test user data:', error);
      }
    }
  }

  const effectiveSession = session || mockSession;

  if (!effectiveSession || !effectiveSession.user?.email) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">
          Sign in to access the Admin Dashboard
        </h1>
        <LoginButton />
      </div>
    );
  }

  const user = new User(effectiveSession.user.email, true);
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
