import { inject, injectable } from 'tsyringe';
import { User } from '@/domain/auth/entities/User';
import type { UserRepository } from '@/domain/auth/repositories/UserRepository';
import type { OAuthService } from './services/OAuthService';
import type { IAuthenticateUser } from './IAuthenticateUser';

@injectable()
export class AuthenticateUser implements IAuthenticateUser {
  constructor(
    @inject('OAuthService') private oAuthService: OAuthService,
    @inject('UserRepository') private userRepository: UserRepository
  ) {}

  async execute(oAuthToken: string): Promise<User> {
    const userData = await this.oAuthService.getUser(oAuthToken);
    const user = new User(userData.email, true);
    await this.userRepository.save(user);
    return user;
  }
}
