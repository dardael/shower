import type { User } from '@/domain/auth/entities/User';

export interface AuthSession {
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface IAuthenticateUser {
  execute(session: AuthSession | null | undefined): Promise<User>;
}
