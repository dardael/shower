import { createAuthClient } from 'better-auth/react';
import type {
  IBetterAuthClientService,
  SessionData,
} from '@/application/auth/services/IBetterAuthClientService';
import { getBaseUrl } from '@/infrastructure/shared/utils/appUrl';

/**
 * Client-side adapter for Better Auth
 * This adapter handles client-side authentication operations
 */
export class BetterAuthClientAdapter implements IBetterAuthClientService {
  private authClient: ReturnType<typeof createAuthClient> | null = null;

  private getClient() {
    if (!this.authClient) {
      this.authClient = createAuthClient({
        baseURL: getBaseUrl(),
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
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      const client = this.getClient();
      await client.signOut();
    } catch (error) {
      throw error;
    }
  }

  useSession(): SessionData {
    const client = this.getClient();
    return client.useSession() as SessionData;
  }
}
