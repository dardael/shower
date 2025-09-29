import { inject, injectable } from 'tsyringe';
import { User } from '@/domain/auth/entities/User';
import type { AdminAccessPolicyService } from '@/domain/auth/services/AdminAccessPolicyService';
import type { IAuthorizeAdminAccess } from './IAuthorizeAdminAccess';
import type { ILogger } from '../shared/ILogger';

@injectable()
export class AuthorizeAdminAccess implements IAuthorizeAdminAccess {
  constructor(
    @inject('AdminAccessPolicyService')
    private adminAccessPolicy: AdminAccessPolicyService,
    @inject('ILogger')
    private logger: ILogger
  ) {}

  execute(user: User): boolean {
    this.logger.logDebug(`Admin access attempted by user: ${user.email}`);
    const isAuthorized = this.adminAccessPolicy.isAuthorized(user.email);
    if (!isAuthorized) {
      this.logger.logWarning(
        `Unauthorized admin access attempt by user: ${user.email}`
      );
    }
    return isAuthorized;
  }
}
