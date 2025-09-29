import 'reflect-metadata';
import { AuthenticateUser } from '@/application/auth/AuthenticateUser';
import { User } from '@/domain/auth/entities/User';
import type { UserRepository } from '@/domain/auth/repositories/UserRepository';
import type { OAuthService } from '@/application/auth/services/OAuthService';
import type { ILogger } from '@/application/shared/ILogger';

// Mock dependencies
const mockOAuthService: jest.Mocked<OAuthService> = {
  getUser: jest.fn(),
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
      mockOAuthService,
      mockUserRepository,
      mockLogger
    );
  });

  it('should authenticate user successfully', async () => {
    const oAuthToken = 'valid-token';
    const userData = { email: 'user@example.com' };
    const expectedUser = new User(userData.email, true);

    mockOAuthService.getUser.mockResolvedValue(userData);
    mockUserRepository.save.mockResolvedValue(undefined);

    const result = await useCase.execute(oAuthToken);

    expect(mockOAuthService.getUser).toHaveBeenCalledWith(oAuthToken);
    expect(mockUserRepository.save).toHaveBeenCalledWith(expectedUser);
    expect(result).toEqual(expectedUser);
    expect(mockLogger.logInfo).toHaveBeenCalledWith(
      'User authenticated successfully: user@example.com'
    );
  });

  it('should handle OAuth service error', async () => {
    const oAuthToken = 'invalid-token';
    const error = new Error('Invalid token');

    mockOAuthService.getUser.mockRejectedValue(error);

    await expect(useCase.execute(oAuthToken)).rejects.toThrow('Invalid token');
    expect(mockLogger.logError).toHaveBeenCalledWith(
      'Unexpected error during authentication: Invalid token',
      { token: oAuthToken }
    );
  });
});
