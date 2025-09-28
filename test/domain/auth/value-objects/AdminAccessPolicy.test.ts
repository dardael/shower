import 'reflect-metadata';
import { AdminAccessPolicy } from '@/domain/auth/value-objects/AdminAccessPolicy';

describe('AdminAccessPolicy', () => {
  it('should authorize if email matches', () => {
    const policy = new AdminAccessPolicy('admin@example.com');
    expect(policy.isAuthorized('admin@example.com')).toBe(true);
  });

  it('should not authorize if email does not match', () => {
    const policy = new AdminAccessPolicy('admin@example.com');
    expect(policy.isAuthorized('user@example.com')).toBe(false);
  });
});
