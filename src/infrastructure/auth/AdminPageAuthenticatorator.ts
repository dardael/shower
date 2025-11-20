import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { auth } from './BetterAuthInstance';
import { User } from '@/domain/auth/entities/User';
import { AuthServiceLocator } from '@/infrastructure/container';

interface Session {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
}

export class AdminPageAuthenticatorator {
  constructor() {}

  async getSession(): Promise<Session | null> {
    const headersList = await headers();

    return await auth.api.getSession({
      headers: headersList,
    });
  }

  /**
   * Creates a mock session for testing purposes
   * @param cookies - The request cookies string
   * @returns A mock session or null if test conditions are not met
   */

  async authenticate(): Promise<void> {
    const effectiveSession = await this.getSession();

    if (!effectiveSession || !effectiveSession.user?.email) {
      notFound();
    }

    const user = new User(effectiveSession.user.email, true);
    const authorizeAdminAccess = AuthServiceLocator.getAuthorizeAdminAccess();
    const isAuthorized = authorizeAdminAccess.execute(user);

    if (!isAuthorized) {
      notFound();
    }
  }

  async isAuthorized(session: Session): Promise<boolean> {
    if (!session.user?.email) {
      return false;
    }

    const user = new User(session.user.email, true);
    const authorizeAdminAccess = AuthServiceLocator.getAuthorizeAdminAccess();
    return authorizeAdminAccess.execute(user);
  }
}
