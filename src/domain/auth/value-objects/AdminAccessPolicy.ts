import { injectable } from 'tsyringe';
import type { AdminAccessPolicyService } from '@/domain/auth/services/AdminAccessPolicyService';

@injectable()
export class AdminAccessPolicy implements AdminAccessPolicyService {
  constructor(private readonly allowedEmail: string) {}

  public isAuthorized(userEmail: string): boolean {
    return userEmail === this.allowedEmail;
  }
}
