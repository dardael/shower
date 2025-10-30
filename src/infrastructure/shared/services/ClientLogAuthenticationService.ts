import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { SystemConsoleLogger } from '@/infrastructure/shared/utils/SystemConsoleLogger';

/**
 * Client Log Authentication Service
 *
 * Provides secure authentication for client-to-server logging without creating
 * circular dependencies with the main logging system.
 *
 * Uses HMAC-based authentication with time-based tokens to prevent log flooding
 * while maintaining performance and scalability.
 */
export class ClientLogAuthenticationService {
  private static instance: ClientLogAuthenticationService;

  // Configuration from environment variables
  private readonly secretKey: string;
  private readonly tokenValidityWindow: number; // in seconds
  private readonly allowedOrigins: string[];
  private readonly enableOriginCheck: boolean;

  private constructor() {
    // Security: Require CLIENT_LOG_SECRET in production
    if (
      process.env.NODE_ENV === 'production' &&
      !process.env.CLIENT_LOG_SECRET
    ) {
      throw new Error(
        'CLIENT_LOG_SECRET environment variable is required in production'
      );
    }

    this.secretKey = process.env.CLIENT_LOG_SECRET || this.generateSecretKey();
    this.tokenValidityWindow = parseInt(
      process.env.CLIENT_LOG_TOKEN_VALIDITY || '300'
    ); // 5 minutes default
    this.allowedOrigins = this.parseAllowedOrigins();
    this.enableOriginCheck =
      process.env.CLIENT_LOG_ENABLE_ORIGIN_CHECK === 'true';

    // Log initialization without using Logger to avoid circular dependency
    if (
      process.env.NODE_ENV !== 'production' &&
      !process.env.CLIENT_LOG_SECRET
    ) {
      // In development, warn about auto-generated secret
      this.logToConsole(
        'INFO: Using auto-generated CLIENT_LOG_SECRET in development. Set CLIENT_LOG_SECRET environment variable for better security.'
      );
    }
  }

  static getInstance(): ClientLogAuthenticationService {
    if (!ClientLogAuthenticationService.instance) {
      ClientLogAuthenticationService.instance =
        new ClientLogAuthenticationService();
    }
    return ClientLogAuthenticationService.instance;
  }

  /**
   * Generate a time-based authentication token for client logging
   */
  generateClientLogToken(timestamp?: number): string {
    const now = timestamp || Math.floor(Date.now() / 1000);
    const data = `client-log-${now}`;
    const hmac = crypto.createHmac('sha256', this.secretKey);
    hmac.update(data);
    const signature = hmac.digest('hex');

    return `${now}.${signature}`;
  }

  /**
   * Validate a client log authentication token
   */
  validateClientLogToken(token: string): { valid: boolean; error?: string } {
    try {
      const parts = token.split('.');
      if (parts.length !== 2) {
        return { valid: false, error: 'Invalid token format' };
      }

      const timestamp = parseInt(parts[0]);
      const providedSignature = parts[1];

      if (isNaN(timestamp)) {
        return { valid: false, error: 'Invalid timestamp' };
      }

      // Check token age
      const now = Math.floor(Date.now() / 1000);
      const age = now - timestamp;

      if (age < 0) {
        return { valid: false, error: 'Token from future' };
      }

      if (age > this.tokenValidityWindow) {
        return { valid: false, error: 'Token expired' };
      }

      // Verify signature
      const expectedData = `client-log-${timestamp}`;
      const hmac = crypto.createHmac('sha256', this.secretKey);
      hmac.update(expectedData);
      const expectedSignature = hmac.digest('hex');

      if (providedSignature !== expectedSignature) {
        return { valid: false, error: 'Invalid signature' };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Validation error',
      };
    }
  }

  /**
   * Validate request origin against allowed origins
   */
  validateOrigin(request: NextRequest): { valid: boolean; error?: string } {
    if (!this.enableOriginCheck) {
      return { valid: true };
    }

    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');

    // Try to determine the origin from various headers
    let requestOrigin: string | null = null;

    if (origin) {
      requestOrigin = origin;
    } else if (referer) {
      try {
        const url = new URL(referer);
        requestOrigin = url.origin;
      } catch {
        // Invalid referer URL
      }
    } else if (host) {
      requestOrigin = `https://${host}`;
    }

    if (!requestOrigin) {
      return { valid: false, error: 'No origin information' };
    }

    // Check if origin is in allowed list
    const isAllowed = this.allowedOrigins.some((allowed) => {
      if (allowed === '*') return true;
      if (allowed === requestOrigin) return true;

      // Support wildcard subdomains
      if (allowed.startsWith('*.')) {
        const domain = allowed.slice(2);
        return (
          requestOrigin.endsWith(domain) ||
          requestOrigin === `https://${domain}`
        );
      }

      return false;
    });

    if (!isAllowed) {
      return {
        valid: false,
        error: `Origin not allowed: ${requestOrigin}`,
      };
    }

    return { valid: true };
  }

  /**
   * Extract and validate authentication from request
   */
  async authenticateRequest(request: NextRequest): Promise<{
    valid: boolean;
    error?: string;
  }> {
    // Check origin first
    const originValidation = this.validateOrigin(request);
    if (!originValidation.valid) {
      return originValidation;
    }

    // Try to extract token from POST body first (most secure for sendBeacon)
    let token: string | null = null;

    try {
      const clonedRequest = request.clone();
      const body = (await clonedRequest.json()) as Record<string, unknown>;

      // Check for secure payload format with auth
      if (
        body &&
        'auth' in body &&
        typeof body.auth === 'object' &&
        body.auth &&
        'token' in body.auth
      ) {
        token = (body.auth as { token: string }).token;
      }
    } catch {
      // Body parsing failed, continue to header method
    }

    // If no token in body, try Authorization header
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader) {
        // Support Bearer token format
        if (authHeader.startsWith('Bearer ')) {
          token = authHeader.slice(7);
        } else {
          token = authHeader;
        }
      }
    }

    if (!token) {
      return { valid: false, error: 'Missing authentication token' };
    }

    return this.validateClientLogToken(token);
  }

  /**
   * Generate a secure secret key if not provided
   */
  private generateSecretKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Parse allowed origins from environment variable
   */
  private parseAllowedOrigins(): string[] {
    const originsEnv = process.env.CLIENT_LOG_ALLOWED_ORIGINS;
    if (!originsEnv) {
      // Default to same origin and localhost for development
      return process.env.NODE_ENV === 'production'
        ? []
        : ['http://localhost:3000', 'https://localhost:3000'];
    }

    return originsEnv
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
  }

  /**
   * Fallback console logging for initialization messages
   * This avoids circular dependency with main Logger
   */
  private logToConsole(message: string): void {
    const systemLogger = SystemConsoleLogger.getInstance();
    systemLogger.info(message, { component: 'ClientLogAuthenticationService' });
  }

  /**
   * Get configuration for client-side usage
   */
  getClientConfig(): {
    tokenValidityWindow: number;
    enableOriginCheck: boolean;
    allowedOrigins: string[];
  } {
    return {
      tokenValidityWindow: this.tokenValidityWindow,
      enableOriginCheck: this.enableOriginCheck,
      allowedOrigins: this.allowedOrigins,
    };
  }
}
