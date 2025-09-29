import 'reflect-metadata';
import { AuthorizeAdminAccess } from '@/application/auth/AuthorizeAdminAccess';
import { AdminAccessPolicy } from '@/domain/auth/value-objects/AdminAccessPolicy';
import { User } from '@/domain/auth/entities/User';
import type { ILogger } from '@/application/shared/ILogger';

const mockLogger: jest.Mocked<ILogger> = {
  logDebug: jest.fn(),
  logInfo: jest.fn(),
  logWarning: jest.fn(),
  logError: jest.fn(),
};

describe('AuthorizeAdminAccess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should authorize admin user', () => {
    const policy = new AdminAccessPolicy('admin@example.com');
    const useCase = new AuthorizeAdminAccess(policy, mockLogger);
    const user = new User('admin@example.com', true);
    expect(useCase.execute(user)).toBe(true);
    expect(mockLogger.logDebug).toHaveBeenCalledWith(
      'Admin access attempted by user: admin@example.com'
    );
    expect(mockLogger.logWarning).not.toHaveBeenCalled();
  });

  it('should not authorize non-admin user', () => {
    const policy = new AdminAccessPolicy('admin@example.com');
    const useCase = new AuthorizeAdminAccess(policy, mockLogger);
    const user = new User('user@example.com', true);
    expect(useCase.execute(user)).toBe(false);
    expect(mockLogger.logDebug).toHaveBeenCalledWith(
      'Admin access attempted by user: user@example.com'
    );
    expect(mockLogger.logWarning).toHaveBeenCalledWith(
      'Unauthorized admin access attempt by user: user@example.com'
    );
  });
});
