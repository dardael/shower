import type { RemoteLoggerConfig } from '@/infrastructure/shared/types/LogEntry';
import { SystemConsoleLogger } from '@/infrastructure/shared/utils/SystemConsoleLogger';

/**
 * Client-side authentication manager for log requests
 *
 * Handles token acquisition, refresh, and attachment to log requests
 * without creating circular dependencies with the logging system.
 */
export class ClientLogAuthManager {
  private static instance: ClientLogAuthManager;
  private token: string | null = null;
  private tokenExpiresAt: number = 0;
  private config: RemoteLoggerConfig;
  private tokenRefreshPromise: Promise<string | null> | null = null;

  private constructor(config?: Partial<RemoteLoggerConfig>) {
    this.config = {
      batchSize: 10,
      batchInterval: 5000,
      maxRetries: 3,
      retryDelay: 1000,
      maxQueueSize: 1000,
      fallbackToConsole: true,
      ...config,
    };
  }

  static getInstance(
    config?: Partial<RemoteLoggerConfig>
  ): ClientLogAuthManager {
    if (!ClientLogAuthManager.instance) {
      ClientLogAuthManager.instance = new ClientLogAuthManager(config);
    }
    return ClientLogAuthManager.instance;
  }

  /**
   * Get current authentication token, refreshing if necessary
   */
  async getAuthToken(): Promise<string | null> {
    // Check if current token is still valid
    if (this.token && this.tokenExpiresAt > Date.now()) {
      return this.token;
    }

    // If refresh is already in progress, return that promise
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    // Get new token
    this.tokenRefreshPromise = this.refreshToken();

    try {
      const newToken = await this.tokenRefreshPromise;
      return newToken;
    } finally {
      this.tokenRefreshPromise = null;
    }
  }

  /**
   * Attach authentication token to request headers
   */
  async attachAuth(
    headers: Record<string, string>
  ): Promise<Record<string, string>> {
    const token = await this.getAuthToken();

    if (token) {
      return {
        ...headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return headers;
  }

  /**
   * Check if authentication is available
   */
  isAuthenticationAvailable(): boolean {
    // In a browser environment, we can always try to get a token
    return typeof window !== 'undefined';
  }

  /**
   * Clear current token (force refresh on next request)
   */
  clearToken(): void {
    this.token = null;
    this.tokenExpiresAt = 0;
  }

  /**
   * Refresh authentication token from server
   */
  private async refreshToken(): Promise<string | null> {
    try {
      const response = await fetch('/api/logs/token', {
        method: 'GET',
        credentials: 'same-origin', // Include cookies for authentication
      });

      if (!response.ok) {
        if (this.config.fallbackToConsole) {
          const systemLogger = SystemConsoleLogger.getInstance();
          systemLogger.warn('Failed to get auth token', {
            status: response.status,
            statusText: response.statusText,
            component: 'ClientLogAuthManager',
          });
        }
        return null;
      }

      const data = await response.json();

      if (data.token && data.expiresAt) {
        this.token = data.token;
        this.tokenExpiresAt = new Date(data.expiresAt).getTime();

        // Set up automatic refresh before expiry
        const refreshDelay = Math.max(
          0,
          this.tokenExpiresAt - Date.now() - 60000 // Refresh 1 minute before expiry
        );

        if (refreshDelay > 0) {
          setTimeout(() => {
            this.refreshToken().catch(() => {
              // Silently fail refresh attempt
            });
          }, refreshDelay);
        }

        return this.token;
      }

      return null;
    } catch (error) {
      if (this.config.fallbackToConsole) {
        const systemLogger = SystemConsoleLogger.getInstance();
        systemLogger.warn('Error refreshing token', {
          error: error instanceof Error ? error.message : 'Unknown error',
          component: 'ClientLogAuthManager',
        });
      }
      return null;
    }
  }

  /**
   * Get token status for debugging
   */
  getTokenStatus(): {
    hasToken: boolean;
    expiresAt: number | null;
    isExpired: boolean;
    timeToExpiry: number | null;
  } {
    const now = Date.now();
    return {
      hasToken: !!this.token,
      expiresAt: this.tokenExpiresAt || null,
      isExpired: this.tokenExpiresAt <= now,
      timeToExpiry: this.tokenExpiresAt
        ? Math.max(0, this.tokenExpiresAt - now)
        : null,
    };
  }

  /**
   * Reset the singleton instance (for testing)
   */
  static resetInstance(): void {
    ClientLogAuthManager.instance = null as unknown as ClientLogAuthManager;
  }
}
