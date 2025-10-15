import { createAuthClient } from 'better-auth/react';
import type {
  IBetterAuthClientService,
  SessionData,
} from '@/application/auth/services/IBetterAuthClientService';

/**
 * Client-side adapter for Better Auth
 * This adapter handles client-side authentication operations
 */
export class BetterAuthClientAdapter implements IBetterAuthClientService {
  private authClient: ReturnType<typeof createAuthClient> | null = null;

  private getClient() {
    if (!this.authClient) {
      this.authClient = createAuthClient({
        baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      });
    }
    return this.authClient;
  }

  async signInSocial(provider: string, callbackURL?: string): Promise<void> {
    try {
      const client = this.getClient();
      await client.signIn.social({
        provider: provider as
          | 'google'
          | 'github'
          | 'discord'
          | 'apple'
          | 'microsoft',
        callbackURL: callbackURL || '/admin',
      });
    } catch (error) {
      console.error('Error signing in with social provider:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      const client = this.getClient();
      await client.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  useSession(): SessionData {
    const client = this.getClient();
    return client.useSession() as SessionData;
  }
}
