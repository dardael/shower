import { inject, injectable } from 'tsyringe';
import { User } from '@/domain/auth/entities/User';
import type { UserRepository } from '@/domain/auth/repositories/UserRepository';
import type { OAuthService } from './services/OAuthService';
import type { IAuthenticateUser } from './IAuthenticateUser';
import type { ILogger } from '../shared/ILogger';

@injectable()
export class AuthenticateUser implements IAuthenticateUser {
  constructor(
    @inject('OAuthService') private oAuthService: OAuthService,
    @inject('UserRepository') private userRepository: UserRepository,
    @inject('ILogger')
    private logger: ILogger
  ) {}

  async execute(oAuthToken: string): Promise<User> {
    try {
      const userData = await this.oAuthService.getUser(oAuthToken);
      const user = new User(userData.email, true);
      await this.userRepository.save(user);
      this.logger.logInfo(`User authenticated successfully: ${user.email}`);
      return user;
    } catch (error) {
      this.logger.logError(
        `Unexpected error during authentication: ${(error as Error).message}`,
        { token: oAuthToken }
      );
      throw error;
    }
  }
}
