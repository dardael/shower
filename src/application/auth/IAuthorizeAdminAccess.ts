import type { User } from '@/domain/auth/entities/User';

export interface IAuthorizeAdminAccess {
  execute(user: User): boolean;
}
