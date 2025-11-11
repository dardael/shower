import { AdminPageAuthenticatorator } from '@/infrastructure/auth/AdminPageAuthenticatorator';
import { Logger } from '@/application/shared/Logger';

// Mock dependencies
jest.mock('@/infrastructure/container');
jest.mock('@/infrastructure/auth/BetterAuthInstance');

// Mock container
const mockContainer: {
  resolve: jest.Mock;
} = {
  resolve: jest.fn(),
};

// Mock next/headers
const mockHeaders = jest.fn();
jest.mock('next/headers', () => ({
  headers: () => mockHeaders(),
}));

// Mock next/navigation
const mockNotFound = jest.fn();
jest.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}));

// Import mocked modules
const mockAuth = {
  api: {
    getSession: jest.fn(),
  },
};

// Setup mocks before tests
beforeAll(() => {
  (
    jest.requireMock('@/infrastructure/auth/BetterAuthInstance') as {
      auth: typeof mockAuth;
    }
  ).auth = mockAuth;
});

describe('AdminPageAuthenticatorator', () => {
  let authenticator: AdminPageAuthenticatorator;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a mock Logger with all methods mocked
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      execute: jest.fn(),
      withContext: jest.fn(),
      logError: jest.fn(),
      logErrorWithObject: jest.fn(),
      logApiRequest: jest.fn(),
      logApiResponse: jest.fn(),
      logSecurity: jest.fn(),
      logUserAction: jest.fn(),
      logBusinessEvent: jest.fn(),
      logSystemEvent: jest.fn(),
      child: jest.fn(),
      batch: jest.fn(),
      logIf: jest.fn(),
      debugIf: jest.fn(),
      startTimer: jest.fn(),
      endTimer: jest.fn(),
      measure: jest.fn(),
      getPerformanceMonitor: jest.fn(),
      getPerformanceStatistics: jest.fn(),
      setPerformanceThreshold: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    // Set up mock to return logger for 'Logger' and anything else for other keys
    mockContainer.resolve.mockImplementation((key: string) => {
      if (key === 'Logger') {
        return mockLogger;
      }
      // Return a mock for any other service
      return {
        execute: jest.fn(),
      };
    });

    authenticator = new AdminPageAuthenticatorator();
  });

  describe('getSession', () => {
    it('should return session when auth provides valid session', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'admin@example.com',
          name: 'Admin User',
          image: null,
        },
        session: {
          id: 'session-123',
          userId: 'user-123',
          expiresAt: new Date(),
        },
      };

      const headersObj = new Headers();
      mockHeaders.mockReturnValue(headersObj);
      mockAuth.api.getSession.mockResolvedValue(mockSession);

      const result = await authenticator.getSession();

      expect(result).toEqual(mockSession);
    });

    it('should create mock session in test environment with test cookie', async () => {
      const originalEnv = process.env.SHOWER_ENV;
      process.env.SHOWER_ENV = 'test';

      try {
        const headersObj = new Headers();
        headersObj.set(
          'cookie',
          'better-auth.session_token=test-session-token; test-user-data={"email":"test@example.com","isAdmin":true}'
        );

        mockHeaders.mockReturnValue(headersObj);
        mockAuth.api.getSession.mockResolvedValue(null);

        const result = await authenticator.getSession();

        expect(result).toEqual({
          user: {
            id: 'test-user-test-example-com',
            email: 'test@example.com',
            name: 'Test Admin',
            image: null,
          },
          session: {
            id: 'test-session-id',
            userId: 'test-user-test-example-com',
            expiresAt: expect.any(Date),
          },
        });
      } finally {
        process.env.SHOWER_ENV = originalEnv;
      }
    });

    it('should return null when no session available', async () => {
      const originalEnv = process.env.SHOWER_ENV;
      process.env.SHOWER_ENV = 'test';

      try {
        const headersObj = new Headers();
        mockHeaders.mockReturnValue(headersObj);
        mockAuth.api.getSession.mockResolvedValue(null);

        const result = await authenticator.getSession();

        expect(result).toBeNull();
      } finally {
        process.env.SHOWER_ENV = originalEnv;
      }
    });
  });

  describe('isAuthorized', () => {
    it('should return false for session without email', async () => {
      const session = {
        user: {
          id: 'user-123',
          email: '',
          name: 'Test User',
          image: null,
        },
        session: {
          id: 'session-123',
          userId: 'user-123',
          expiresAt: new Date(),
        },
      };

      // Mock AuthorizeAdminAccess to return false for empty email
      mockContainer.resolve.mockImplementation((key: string) => {
        if (key === 'Logger') {
          return mockLogger;
        }
        if (key === 'IAuthorizeAdminAccess') {
          return { execute: jest.fn().mockReturnValue(false) };
        }
        return { execute: jest.fn() };
      });

      const result = await authenticator.isAuthorized(session);

      expect(result).toBe(false);
    });

    it('should return true for authorized admin session', async () => {
      const session = {
        user: {
          id: 'user-123',
          email: 'admin@example.com',
          name: 'Admin User',
          image: null,
        },
        session: {
          id: 'session-123',
          userId: 'user-123',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      };

      // Mock AuthorizeAdminAccess to return true for admin email
      mockContainer.resolve.mockImplementation((key: string) => {
        if (key === 'Logger') {
          return mockLogger;
        }
        if (key === 'IAuthorizeAdminAccess') {
          return { execute: jest.fn().mockReturnValue(true) };
        }
        return { execute: jest.fn() };
      });

      const result = await authenticator.isAuthorized(session);

      expect(result).toBe(true);
    });
  });

  describe('authenticate', () => {
    it('should not call notFound when authorized', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'admin@example.com',
          name: 'Admin User',
          image: null,
        },
        session: {
          id: 'session-123',
          userId: 'user-123',
          expiresAt: new Date(),
        },
      };

      jest.spyOn(authenticator, 'getSession').mockResolvedValue(mockSession);
      jest.spyOn(authenticator, 'isAuthorized').mockResolvedValue(true);

      await authenticator.authenticate();

      expect(mockNotFound).not.toHaveBeenCalled();
    });

    it('should call notFound when no session', async () => {
      jest.spyOn(authenticator, 'getSession').mockResolvedValue(null);

      await authenticator.authenticate();

      expect(mockNotFound).toHaveBeenCalled();
    });
  });
});
