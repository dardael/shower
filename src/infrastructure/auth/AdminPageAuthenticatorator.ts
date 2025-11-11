import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { auth } from './BetterAuthInstance';
import { User } from '@/domain/auth/entities/User';
import { AuthServiceLocator } from '@/infrastructure/container';
import { isTestEnvironment } from '@/infrastructure/shared/utils/envValidation';

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

    const session = await auth.api.getSession({
      headers: headersList,
    });

    // Check for test authentication cookie (only in test environment)
    const cookies = headersList.get('cookie');
    const mockSession = this.createTestSession(cookies);

    return session || mockSession;
  }

  /**
   * Creates a mock session for testing purposes
   * @param cookies - The request cookies string
   * @returns A mock session or null if test conditions are not met
   */
  private createTestSession(cookies: string | null): Session | null {
    if (!isTestEnvironment()) {
      return null;
    }

    const testSessionToken = cookies?.includes(
      'better-auth.session_token=test-session-token'
    );
    if (!testSessionToken) {
      return null;
    }

    const userDataCookie = cookies?.match(/test-user-data=([^;]+)/)?.[1];
    if (!userDataCookie) {
      return null;
    }

    try {
      const userData = JSON.parse(decodeURIComponent(userDataCookie));
      const userId = `test-user-${userData.email.replace(/[^a-zA-Z0-9]/g, '-')}`;

      return {
        user: {
          id: userId,
          email: userData.email,
          name: userData.isAdmin ? 'Test Admin' : 'Test User',
          image: null,
        },
        session: {
          id: 'test-session-id',
          userId,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      };
    } catch {
      return null;
    }
  }

  async authenticate(): Promise<void> {
    const effectiveSession = await this.getSession();

    if (!effectiveSession || !effectiveSession.user?.email) {
      notFound();
      return;
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
