import type { BetterFetchError } from '@better-fetch/fetch';

export interface SessionData {
  data: {
    user: {
      id: string;
      name?: string;
      email?: string | null;
      image?: string;
      emailVerified: boolean;
      [key: string]: unknown;
    } | null;
  };
  error: BetterFetchError | null;
  isPending: boolean;
  refetch: (queryParams?: { query?: unknown }) => void;
}

export interface IBetterAuthClientService {
  signInSocial(provider: string, callbackURL?: string): Promise<void>;
  signOut(): Promise<void>;
  useSession(): SessionData;
}
