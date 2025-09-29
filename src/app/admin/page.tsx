import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/infrastructure/auth/api/NextAuthHandler';
import { User } from '@/domain/auth/entities/User';
import { AuthServiceLocator } from '@/infrastructure/container';
import LoginButton from '@/presentation/shared/components/LoginButton';
import AdminDashboard from '@/presentation/admin/components/AdminDashboard';
import NotAuthorized from '@/presentation/admin/components/NotAuthorized';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

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

  if (isAuthorized) {
    return <AdminDashboard />;
  } else {
    return <NotAuthorized />;
  }
}
