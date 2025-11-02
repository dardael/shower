/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import { ClientLogAuthenticationService } from '@/infrastructure/shared/services/ClientLogAuthenticationService';

// Mock Request for Node.js environment
interface MockRequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

global.Request =
  global.Request ||
  class MockRequest {
    private _body: string;

    constructor(url: string, options: MockRequestOptions = {}) {
      this.url = url;
      this.method = options.method || 'GET';
      this.headers = new Map(Object.entries(options.headers || {}));
      this._body = options.body || '';
    }

    url: string;
    method: string;
    headers: Map<string, string>;

    async json(): Promise<any> {
      if (!this._body) {
        throw new Error('No body to parse');
      }
      try {
        return JSON.parse(this._body);
      } catch {
        throw new Error('Invalid JSON in request body');
      }
    }

    async text(): Promise<string> {
      return this._body;
    }

    clone(): MockRequest {
      return new MockRequest(this.url, {
        method: this.method,
        headers: Object.fromEntries(this.headers),
        body: this._body,
      });
    }
  };

// Mock console methods to suppress output in tests
let consoleSpy: {
  log: jest.SpyInstance;
  warn: jest.SpyInstance;
  error: jest.SpyInstance;
  info: jest.SpyInstance;
};

beforeEach(() => {
  consoleSpy = {
    log: jest.spyOn(console, 'log').mockImplementation(),
    warn: jest.spyOn(console, 'warn').mockImplementation(),
    error: jest.spyOn(console, 'error').mockImplementation(),
    info: jest.spyOn(console, 'info').mockImplementation(),
  };
});

afterEach(() => {
  Object.values(consoleSpy).forEach((spy) => spy.mockRestore());
  jest.clearAllMocks();
});

describe('ClientLogAuthenticationService', () => {
  let service: ClientLogAuthenticationService;

  // Helper to safely set environment variables
  const setEnvVar = (key: string, value: string | undefined) => {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  };

  beforeEach(() => {
    // Reset environment variables
    setEnvVar('CLIENT_LOG_SECRET', undefined);
    setEnvVar('CLIENT_LOG_TOKEN_VALIDITY', undefined);
    setEnvVar('CLIENT_LOG_ALLOWED_ORIGINS', undefined);
    setEnvVar('CLIENT_LOG_ENABLE_ORIGIN_CHECK', undefined);

    // Reset singleton instance
    (
      ClientLogAuthenticationService as unknown as {
        instance: ClientLogAuthenticationService | null;
      }
    ).instance = null;
    service = ClientLogAuthenticationService.getInstance();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const service1 = ClientLogAuthenticationService.getInstance();
      const service2 = ClientLogAuthenticationService.getInstance();
      expect(service1).toBe(service2);
    });

    it('should create a new instance when accessed directly', () => {
      const directService = new (ClientLogAuthenticationService as unknown as {
        new (): ClientLogAuthenticationService;
      })();
      expect(directService).toBeInstanceOf(ClientLogAuthenticationService);
    });
  });

  describe('Security Requirements', () => {
    it('should have empty allowed origins in production when none specified', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      const originalSecret = process.env.CLIENT_LOG_SECRET;

      setEnvVar('NODE_ENV', 'production');
      setEnvVar('CLIENT_LOG_SECRET', 'test-secret');
      setEnvVar('CLIENT_LOG_ALLOWED_ORIGINS', undefined);
      (
        ClientLogAuthenticationService as unknown as {
          instance: ClientLogAuthenticationService | null;
        }
      ).instance = null;
      const prodService = ClientLogAuthenticationService.getInstance();

      const config = prodService.getClientConfig();
      expect(config.allowedOrigins).toEqual([]);

      // Restore environment variables
      setEnvVar('NODE_ENV', originalNodeEnv);
      setEnvVar('CLIENT_LOG_SECRET', originalSecret);
    });

    it('should work with CLIENT_LOG_SECRET in production', () => {
      const originalNodeEnv = process.env.NODE_ENV;

      setEnvVar('NODE_ENV', 'production');
      setEnvVar('CLIENT_LOG_SECRET', 'test-secret');

      expect(() => {
        (
          ClientLogAuthenticationService as unknown as {
            instance: ClientLogAuthenticationService | null;
          }
        ).instance = null;
        new (ClientLogAuthenticationService as unknown as {
          new (): ClientLogAuthenticationService;
        })();
      }).not.toThrow();

      setEnvVar('NODE_ENV', originalNodeEnv);
    });

    it('should generate a secret key in development when not provided', () => {
      const originalNodeEnv = process.env.NODE_ENV;

      setEnvVar('NODE_ENV', 'development');
      setEnvVar('CLIENT_LOG_SECRET', undefined);

      (
        ClientLogAuthenticationService as unknown as {
          instance: ClientLogAuthenticationService | null;
        }
      ).instance = null;
      const devService = ClientLogAuthenticationService.getInstance();

      expect(devService).toBeInstanceOf(ClientLogAuthenticationService);

      setEnvVar('NODE_ENV', originalNodeEnv);
    });

    it('should log a warning when using auto-generated secret in development', () => {
      const originalNodeEnv = process.env.NODE_ENV;

      setEnvVar('NODE_ENV', 'development');
      setEnvVar('CLIENT_LOG_SECRET', undefined);

      (
        ClientLogAuthenticationService as unknown as {
          instance: ClientLogAuthenticationService | null;
        }
      ).instance = null;
      new (ClientLogAuthenticationService as unknown as {
        new (): ClientLogAuthenticationService;
      })();

      // Check that some console output was made (the exact format may vary)
      expect(consoleSpy.info).toHaveBeenCalled();

      setEnvVar('NODE_ENV', originalNodeEnv);
    });
  });

  describe('Token Generation', () => {
    it('should generate a token with current timestamp', () => {
      const beforeTime = Math.floor(Date.now() / 1000);
      const token = service.generateClientLogToken();
      const afterTime = Math.floor(Date.now() / 1000);

      const [timestamp] = token.split('.');
      const tokenTime = parseInt(timestamp);

      expect(tokenTime).toBeGreaterThanOrEqual(beforeTime);
      expect(tokenTime).toBeLessThanOrEqual(afterTime);
    });

    it('should generate token with custom timestamp', () => {
      const customTimestamp = 1234567890;
      const token = service.generateClientLogToken(customTimestamp);

      const parts = token.split('.');
      expect(parts).toHaveLength(2);
      expect(parts[0]).toBe(customTimestamp.toString());
      expect(parts[1]).toMatch(/^[a-f0-9]+$/); // Should have a valid hex signature
    });

    it('should generate different tokens for different calls', () => {
      const token1 = service.generateClientLogToken();
      // Force a different timestamp by advancing time
      jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 1000);
      const token2 = service.generateClientLogToken();

      // Restore original Date.now
      jest.restoreAllMocks();

      expect(token1).not.toBe(token2);
    });

    it('should generate tokens with valid format', () => {
      const token = service.generateClientLogToken();
      const parts = token.split('.');

      expect(parts).toHaveLength(2);
      expect(parts[0]).toMatch(/^\d+$/); // Timestamp
      expect(parts[1]).toMatch(/^[a-f0-9]+$/); // Hex signature
    });
  });

  describe('Token Validation', () => {
    it('should validate a correctly formatted token', () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const token = service.generateClientLogToken(timestamp);
      const result = service.validateClientLogToken(token);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject token with invalid format', () => {
      const invalidTokens = [
        'invalid',
        'timestamp',
        '.signature',
        'timestamp.invalid.signature',
        '',
      ];

      invalidTokens.forEach((token) => {
        const result = service.validateClientLogToken(token);
        expect(result.valid).toBe(false);
        // Error message may vary based on the specific invalid format
        expect(result.error).toBeDefined();
      });
    });

    it('should reject token with invalid timestamp', () => {
      const result = service.validateClientLogToken('timestamp.');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid timestamp');
    });

    it('should reject token from future', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3600; // 1 hour in future
      const token = service.generateClientLogToken(futureTimestamp);
      const result = service.validateClientLogToken(token);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Token from future');
    });

    it('should reject expired token', () => {
      const expiredTimestamp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const token = service.generateClientLogToken(expiredTimestamp);
      const result = service.validateClientLogToken(token);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Token expired');
    });

    it('should reject token with invalid signature', () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const token = `${timestamp}.invalidsignature`;
      const result = service.validateClientLogToken(token);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid signature');
    });

    it('should validate token within validity window', () => {
      const timestamp = Math.floor(Date.now() / 1000) - 60; // 1 minute ago
      const token = service.generateClientLogToken(timestamp);
      const result = service.validateClientLogToken(token);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should handle validation errors gracefully', () => {
      // Test with malformed token that will cause parsing errors
      const malformedToken = 'not.a.valid.token.format';
      const result = service.validateClientLogToken(malformedToken);

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Origin Validation', () => {
    beforeEach(() => {
      process.env.CLIENT_LOG_ENABLE_ORIGIN_CHECK = 'true';
      process.env.CLIENT_LOG_ALLOWED_ORIGINS =
        'https://example.com,https://test.com';
      (
        ClientLogAuthenticationService as unknown as {
          instance: ClientLogAuthenticationService | null;
        }
      ).instance = null;
      service = ClientLogAuthenticationService.getInstance();
    });

    it('should allow valid origin from Origin header', () => {
      const request = new Request('https://example.com/api/logs', {
        headers: { origin: 'https://example.com' },
      }) as NextRequest;

      const result = service.validateOrigin(request);
      expect(result.valid).toBe(true);
    });

    it('should allow valid origin from Referer header', () => {
      const request = new Request('https://example.com/api/logs', {
        headers: { referer: 'https://example.com/page' },
      }) as NextRequest;

      const result = service.validateOrigin(request);
      expect(result.valid).toBe(true);
    });

    it('should allow origin from Host header', () => {
      const request = new Request('https://example.com/api/logs', {
        headers: { host: 'example.com' },
      }) as NextRequest;

      const result = service.validateOrigin(request);
      expect(result.valid).toBe(true);
    });

    it('should reject disallowed origin', () => {
      const request = new Request('https://malicious.com/api/logs', {
        headers: { origin: 'https://malicious.com' },
      }) as NextRequest;

      const result = service.validateOrigin(request);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Origin not allowed: https://malicious.com');
    });

    it('should reject when no origin information available', () => {
      const request = new Request(
        'https://example.com/api/logs',
        {}
      ) as NextRequest;

      const result = service.validateOrigin(request);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('No origin information');
    });

    it('should handle wildcard origin', () => {
      process.env.CLIENT_LOG_ALLOWED_ORIGINS = '*';
      (
        ClientLogAuthenticationService as unknown as {
          instance: ClientLogAuthenticationService | null;
        }
      ).instance = null;
      const wildcardService = ClientLogAuthenticationService.getInstance();

      const request = new Request('https://any-domain.com/api/logs', {
        headers: { origin: 'https://any-domain.com' },
      }) as NextRequest;

      const result = wildcardService.validateOrigin(request);
      expect(result.valid).toBe(true);
    });

    it('should handle wildcard subdomains', () => {
      process.env.CLIENT_LOG_ALLOWED_ORIGINS = '*.example.com';
      (
        ClientLogAuthenticationService as unknown as {
          instance: ClientLogAuthenticationService | null;
        }
      ).instance = null;
      const wildcardService = ClientLogAuthenticationService.getInstance();

      const requests = [
        { origin: 'https://api.example.com', expected: true },
        { origin: 'https://app.example.com', expected: true },
        { origin: 'https://malicious.com', expected: false },
      ];

      requests.forEach(({ origin, expected }) => {
        const request = new Request('https://example.com/api/logs', {
          headers: { origin },
        }) as NextRequest;

        const result = wildcardService.validateOrigin(request);
        expect(result.valid).toBe(expected);
      });
    });

    it('should skip origin validation when disabled', () => {
      process.env.CLIENT_LOG_ENABLE_ORIGIN_CHECK = 'false';
      (
        ClientLogAuthenticationService as unknown as {
          instance: ClientLogAuthenticationService | null;
        }
      ).instance = null;
      const noCheckService = ClientLogAuthenticationService.getInstance();

      const request = new Request('https://malicious.com/api/logs', {
        headers: { origin: 'https://malicious.com' },
      }) as NextRequest;

      const result = noCheckService.validateOrigin(request);
      expect(result.valid).toBe(true);
    });

    it('should handle invalid referer URL gracefully', () => {
      const request = new Request('https://example.com/api/logs', {
        headers: { referer: 'invalid-url' },
      }) as NextRequest;

      const result = service.validateOrigin(request);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('No origin information');
    });

    it('should use default origins in development when none specified', () => {
      const originalNodeEnv = process.env.NODE_ENV;

      setEnvVar('NODE_ENV', 'development');
      setEnvVar('CLIENT_LOG_ALLOWED_ORIGINS', undefined);
      (
        ClientLogAuthenticationService as unknown as {
          instance: ClientLogAuthenticationService | null;
        }
      ).instance = null;
      const devService = ClientLogAuthenticationService.getInstance();

      const request = new Request('https://localhost:3000/api/logs', {
        headers: { origin: 'https://localhost:3000' },
      }) as NextRequest;

      const result = devService.validateOrigin(request);
      expect(result.valid).toBe(true);

      setEnvVar('NODE_ENV', originalNodeEnv);
    });

    it('should have empty allowed origins in production when none specified', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      const originalSecret = process.env.CLIENT_LOG_SECRET;

      setEnvVar('NODE_ENV', 'production');
      setEnvVar('CLIENT_LOG_SECRET', 'test-secret');
      setEnvVar('CLIENT_LOG_ALLOWED_ORIGINS', undefined);
      (
        ClientLogAuthenticationService as unknown as {
          instance: ClientLogAuthenticationService | null;
        }
      ).instance = null;
      const prodService = ClientLogAuthenticationService.getInstance();

      const config = prodService.getClientConfig();
      expect(config.allowedOrigins).toEqual([]);

      // Restore environment variables
      setEnvVar('NODE_ENV', originalNodeEnv);
      setEnvVar('CLIENT_LOG_SECRET', originalSecret);
    });
  });

  describe('Request Authentication', () => {
    beforeEach(() => {
      // Ensure we have a secret for testing
      if (!process.env.CLIENT_LOG_SECRET) {
        process.env.CLIENT_LOG_SECRET = 'test-secret';
      }
      process.env.CLIENT_LOG_ENABLE_ORIGIN_CHECK = 'false';
      (
        ClientLogAuthenticationService as unknown as {
          instance: ClientLogAuthenticationService | null;
        }
      ).instance = null;
      service = ClientLogAuthenticationService.getInstance();
    });

    it('should authenticate request with token in POST body', async () => {
      const token = service.generateClientLogToken();
      const request = new Request('https://example.com/api/logs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          logs: [{ message: 'test' }],
          auth: { token },
        }),
      }) as NextRequest;

      const result = await service.authenticateRequest(request);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should authenticate request with Bearer token in header', async () => {
      const token = service.generateClientLogToken();
      const request = new Request('https://example.com/api/logs', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
        },
      }) as NextRequest;

      const result = await service.authenticateRequest(request);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should authenticate request with token in Authorization header', async () => {
      const token = service.generateClientLogToken();
      const request = new Request('https://example.com/api/logs', {
        method: 'POST',
        headers: {
          authorization: token,
        },
      }) as NextRequest;

      const result = await service.authenticateRequest(request);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject request without authentication token', async () => {
      const request = new Request('https://example.com/api/logs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ logs: [{ message: 'test' }] }),
      }) as NextRequest;

      const result = await service.authenticateRequest(request);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Missing authentication token');
    });

    it('should reject request with invalid token in body', async () => {
      const request = new Request('https://example.com/api/logs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          logs: [{ message: 'test' }],
          auth: { token: 'invalid-token' },
        }),
      }) as NextRequest;

      const result = await service.authenticateRequest(request);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject request with invalid token in header', async () => {
      const request = new Request('https://example.com/api/logs', {
        method: 'POST',
        headers: {
          authorization: 'invalid-token',
        },
      }) as NextRequest;

      const result = await service.authenticateRequest(request);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle malformed JSON body gracefully', async () => {
      const request = new Request('https://example.com/api/logs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: 'invalid-json',
      }) as NextRequest;

      const result = await service.authenticateRequest(request);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Missing authentication token');
    });

    it('should validate origin before token', async () => {
      process.env.CLIENT_LOG_ENABLE_ORIGIN_CHECK = 'true';
      process.env.CLIENT_LOG_ALLOWED_ORIGINS = 'https://example.com';
      (
        ClientLogAuthenticationService as unknown as {
          instance: ClientLogAuthenticationService | null;
        }
      ).instance = null;
      const originService = ClientLogAuthenticationService.getInstance();

      const token = originService.generateClientLogToken();
      const request = new Request('https://malicious.com/api/logs', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          origin: 'https://malicious.com',
        },
        body: JSON.stringify({
          logs: [{ message: 'test' }],
          auth: { token },
        }),
      }) as NextRequest;

      const result = await originService.authenticateRequest(request);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Origin not allowed: https://malicious.com');
    });

    it('should handle complex auth object structure', async () => {
      const token = service.generateClientLogToken();
      const request = new Request('https://example.com/api/logs', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          origin: 'https://example.com',
        },
        body: JSON.stringify({
          logs: [{ message: 'test' }],
          auth: {
            token,
            metadata: { client: 'test' },
          },
        }),
      }) as NextRequest;

      const result = await service.authenticateRequest(request);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should handle missing auth object', async () => {
      const request = new Request('https://example.com/api/logs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          logs: [{ message: 'test' }],
        }),
      }) as NextRequest;

      const result = await service.authenticateRequest(request);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Missing authentication token');
    });
  });

  describe('Configuration', () => {
    it('should use default token validity when not specified', () => {
      delete process.env.CLIENT_LOG_TOKEN_VALIDITY;
      (
        ClientLogAuthenticationService as unknown as {
          instance: ClientLogAuthenticationService | null;
        }
      ).instance = null;
      const defaultService = ClientLogAuthenticationService.getInstance();

      const config = defaultService.getClientConfig();
      expect(config.tokenValidityWindow).toBe(300); // 5 minutes
    });

    it('should use custom token validity when specified', () => {
      process.env.CLIENT_LOG_TOKEN_VALIDITY = '600';
      (
        ClientLogAuthenticationService as unknown as {
          instance: ClientLogAuthenticationService | null;
        }
      ).instance = null;
      const customService = ClientLogAuthenticationService.getInstance();

      const config = customService.getClientConfig();
      expect(config.tokenValidityWindow).toBe(600); // 10 minutes
    });

    it('should parse allowed origins correctly', () => {
      process.env.CLIENT_LOG_ALLOWED_ORIGINS =
        'https://a.com, https://b.com ,https://c.com';
      (
        ClientLogAuthenticationService as unknown as {
          instance: ClientLogAuthenticationService | null;
        }
      ).instance = null;
      const parseService = ClientLogAuthenticationService.getInstance();

      const config = parseService.getClientConfig();
      expect(config.allowedOrigins).toEqual([
        'https://a.com',
        'https://b.com',
        'https://c.com',
      ]);
    });

    it('should handle empty allowed origins', () => {
      const originalNodeEnv = process.env.NODE_ENV;

      setEnvVar('NODE_ENV', 'production');
      setEnvVar('CLIENT_LOG_SECRET', 'test-secret');
      setEnvVar('CLIENT_LOG_ALLOWED_ORIGINS', '');
      (
        ClientLogAuthenticationService as unknown as {
          instance: ClientLogAuthenticationService | null;
        }
      ).instance = null;
      const emptyService = ClientLogAuthenticationService.getInstance();

      const config = emptyService.getClientConfig();
      expect(config.allowedOrigins).toEqual([]);

      // Restore NODE_ENV
      setEnvVar('NODE_ENV', originalNodeEnv);
    });

    it('should provide client configuration', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      setEnvVar('NODE_ENV', 'development');

      (
        ClientLogAuthenticationService as unknown as {
          instance: ClientLogAuthenticationService | null;
        }
      ).instance = null;
      const devService = ClientLogAuthenticationService.getInstance();

      const config = devService.getClientConfig();

      expect(config).toEqual({
        tokenValidityWindow: 300,
        enableOriginCheck: false,
        allowedOrigins: ['http://localhost:3000', 'https://localhost:3000'],
      });

      setEnvVar('NODE_ENV', originalNodeEnv);
    });
  });

  describe('Error Handling', () => {
    it('should handle crypto errors in token generation', () => {
      // Test by providing invalid secret that causes crypto issues
      const originalSecret = process.env.CLIENT_LOG_SECRET;
      const originalNodeEnv = process.env.NODE_ENV;

      setEnvVar('NODE_ENV', 'production');
      setEnvVar('CLIENT_LOG_SECRET', '');

      (
        ClientLogAuthenticationService as unknown as {
          instance: ClientLogAuthenticationService | null;
        }
      ).instance = null;

      expect(() => {
        ClientLogAuthenticationService.getInstance();
      }).toThrow(
        'CLIENT_LOG_SECRET environment variable is required in production'
      );

      setEnvVar('CLIENT_LOG_SECRET', originalSecret);
      setEnvVar('NODE_ENV', originalNodeEnv);
    });

    it('should handle validation errors gracefully', () => {
      // Test with malformed token that will cause parsing errors
      const malformedToken = 'not.a.valid.token.format';
      const result = service.validateClientLogToken(malformedToken);

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle non-Error objects in validation', () => {
      // Test with malformed token that will cause parsing errors
      const malformedToken = '';
      const result = service.validateClientLogToken(malformedToken);

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long origin strings', () => {
      const longOrigin = 'https://' + 'a'.repeat(1000) + '.com';
      process.env.CLIENT_LOG_ALLOWED_ORIGINS = longOrigin;
      (
        ClientLogAuthenticationService as unknown as {
          instance: ClientLogAuthenticationService | null;
        }
      ).instance = null;
      const longService = ClientLogAuthenticationService.getInstance();

      const request = new Request('https://example.com/api/logs', {
        headers: { origin: longOrigin },
      }) as NextRequest;

      const result = longService.validateOrigin(request);
      expect(result.valid).toBe(true);
    });

    it('should handle special characters in origins', () => {
      const specialOrigin =
        'https://test-with-dashes_and_underscores.example.com';
      process.env.CLIENT_LOG_ALLOWED_ORIGINS = specialOrigin;
      (
        ClientLogAuthenticationService as unknown as {
          instance: ClientLogAuthenticationService | null;
        }
      ).instance = null;
      const specialService = ClientLogAuthenticationService.getInstance();

      const request = new Request('https://example.com/api/logs', {
        headers: { origin: specialOrigin },
      }) as NextRequest;

      const result = specialService.validateOrigin(request);
      expect(result.valid).toBe(true);
    });

    it('should handle empty token string', () => {
      const result = service.validateClientLogToken('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid token format');
    });

    it('should handle whitespace-only token', () => {
      const result = service.validateClientLogToken('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid token format');
    });
  });
});
