import { injectable } from 'tsyringe';
import { OAuthService } from '@/application/auth/services/OAuthService';

@injectable()
export class GoogleOAuthAdapter implements OAuthService {
  async getUser(): Promise<{ email: string }> {
    // Placeholder: integrate with next-auth or Google APIs
    // For now, return mock data
    return { email: 'mock@example.com' };
  }
}
