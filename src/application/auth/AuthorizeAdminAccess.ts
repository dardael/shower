import { inject, injectable } from 'tsyringe';
import { User } from '@/domain/auth/entities/User';
import type { AdminAccessPolicyService } from '@/domain/auth/services/AdminAccessPolicyService';
import type { IAuthorizeAdminAccess } from './IAuthorizeAdminAccess';

@injectable()
export class AuthorizeAdminAccess implements IAuthorizeAdminAccess {
  constructor(
    @inject('AdminAccessPolicyService')
    private adminAccessPolicy: AdminAccessPolicyService
  ) {}

  execute(user: User): boolean {
    return this.adminAccessPolicy.isAuthorized(user.email);
  }
}
