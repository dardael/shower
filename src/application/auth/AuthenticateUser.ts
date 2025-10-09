import { inject, injectable } from 'tsyringe';
import { User } from '@/domain/auth/entities/User';
import type { UserRepository } from '@/domain/auth/repositories/UserRepository';
import type { IBetterAuthService } from './services/IBetterAuthService';
import type { IAuthenticateUser, AuthSession } from './IAuthenticateUser';
import type { ILogger } from '../shared/ILogger';

@injectable()
export class AuthenticateUser implements IAuthenticateUser {
  constructor(
    @inject('IBetterAuthService') private betterAuthService: IBetterAuthService,
    @inject('UserRepository') private userRepository: UserRepository,
    @inject('ILogger')
    private logger: ILogger
  ) {}

  async execute(session: AuthSession | null): Promise<User> {
    try {
      if (!session || !session.user) {
        throw new Error('Invalid session provided');
      }

      const userData = session.user;
      const user = new User(userData.email, true);
      await this.userRepository.save(user);
      this.logger.logInfo(`User authenticated successfully: ${user.email}`);
      return user;
    } catch (error) {
      this.logger.logError(
        `Unexpected error during authentication: ${(error as Error).message}`,
        { session }
      );
      throw error;
    }
  }
}
