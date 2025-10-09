import 'reflect-metadata';
import { AuthenticateUser } from '@/application/auth/AuthenticateUser';
import type { UserRepository } from '@/domain/auth/repositories/UserRepository';
import type { IBetterAuthService } from '@/application/auth/services/IBetterAuthService';
import type { ILogger } from '@/application/shared/ILogger';
import type { AuthSession } from '@/application/auth/IAuthenticateUser';

// Mock dependencies
const mockBetterAuthService: jest.Mocked<IBetterAuthService> = {
  getSession: jest.fn(),
  signInSocial: jest.fn(),
  signOut: jest.fn(),
};

const mockUserRepository: jest.Mocked<UserRepository> = {
  save: jest.fn(),
  findByEmail: jest.fn(),
};

const mockLogger: jest.Mocked<ILogger> = {
  logDebug: jest.fn(),
  logInfo: jest.fn(),
  logWarning: jest.fn(),
  logError: jest.fn(),
};

describe('AuthenticateUser', () => {
  let useCase: AuthenticateUser;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new AuthenticateUser(
      mockBetterAuthService,
      mockUserRepository,
      mockLogger
    );
  });

  it('should authenticate user successfully', async () => {
    const session = {
      user: {
        id: 'test-user-id',
        email: 'user@example.com',
        name: 'Test User',
        image: null,
      },
      session: {
        id: 'test-session-id',
        userId: 'test-user-id',
        expiresAt: new Date(),
        token: 'test-token',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    mockUserRepository.save.mockResolvedValue(undefined);

    const result = await useCase.execute(session);

    expect(mockUserRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'user@example.com',
        isAuthenticated: true,
      })
    );
    expect(result).toEqual(
      expect.objectContaining({
        email: 'user@example.com',
        isAuthenticated: true,
      })
    );
    expect(mockLogger.logInfo).toHaveBeenCalledWith(
      'User authenticated successfully: user@example.com'
    );
  });

  it('should handle invalid session error', async () => {
    const session = null;

    await expect(useCase.execute(session)).rejects.toThrow(
      'Invalid session provided'
    );
    expect(mockLogger.logError).toHaveBeenCalledWith(
      'Unexpected error during authentication: Invalid session provided',
      { session }
    );
  });

  it('should handle session without user error', async () => {
    const session = { session: {}, user: null } as unknown as AuthSession;

    await expect(useCase.execute(session)).rejects.toThrow(
      'Invalid session provided'
    );
    expect(mockLogger.logError).toHaveBeenCalledWith(
      'Unexpected error during authentication: Invalid session provided',
      { session }
    );
  });
});
