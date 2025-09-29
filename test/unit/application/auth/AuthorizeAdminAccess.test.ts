import 'reflect-metadata';
import { AuthorizeAdminAccess } from '@/application/auth/AuthorizeAdminAccess';
import { AdminAccessPolicy } from '@/domain/auth/value-objects/AdminAccessPolicy';
import { User } from '@/domain/auth/entities/User';

describe('AuthorizeAdminAccess', () => {
  it('should authorize admin user', () => {
    const policy = new AdminAccessPolicy('admin@example.com');
    const useCase = new AuthorizeAdminAccess(policy);
    const user = new User('admin@example.com', true);
    expect(useCase.execute(user)).toBe(true);
  });

  it('should not authorize non-admin user', () => {
    const policy = new AdminAccessPolicy('admin@example.com');
    const useCase = new AuthorizeAdminAccess(policy);
    const user = new User('user@example.com', true);
    expect(useCase.execute(user)).toBe(false);
  });
});
