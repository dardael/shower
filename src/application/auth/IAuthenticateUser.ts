import type { User } from '@/domain/auth/entities/User';

export interface IAuthenticateUser {
  execute(oAuthToken: string): Promise<User>;
}
