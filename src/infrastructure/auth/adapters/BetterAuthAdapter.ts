import { injectable } from 'tsyringe';
import { auth } from '../BetterAuthInstance';
import type { IBetterAuthService } from '@/application/auth/services/IBetterAuthService';

@injectable()
export class BetterAuthAdapter implements IBetterAuthService {
  async getSession(headers: Headers): Promise<unknown> {
    try {
      const session = await auth.api.getSession({
        headers,
      });
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  async signInSocial(): Promise<void> {
    // This method is typically called from the client side
    // Server-side implementation would be different
    throw new Error(
      'signInSocial should be called from client side using Better Auth client'
    );
  }

  async signOut(): Promise<void> {
    // This method is typically called from the client side
    // Server-side implementation would be different
    throw new Error(
      'signOut should be called from client side using Better Auth client'
    );
  }
}
