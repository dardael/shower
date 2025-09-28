import 'reflect-metadata';
import { container } from 'tsyringe';
import type { UserRepository } from '@/domain/auth/repositories/UserRepository';
import type { AdminAccessPolicyService } from '@/domain/auth/services/AdminAccessPolicyService';
import type { OAuthService } from '@/application/auth/services/OAuthService';
import type { IAuthenticateUser } from '@/application/auth/IAuthenticateUser';
import type { IAuthorizeAdminAccess } from '@/application/auth/IAuthorizeAdminAccess';
import { AdminAccessPolicy } from '@/domain/auth/value-objects/AdminAccessPolicy';
import { AuthenticateUser } from '@/application/auth/AuthenticateUser';
import { AuthorizeAdminAccess } from '@/application/auth/AuthorizeAdminAccess';
import { GoogleOAuthAdapter } from '@/infrastructure/auth/adapters/GoogleOAuthAdapter';
import { InMemoryUserRepository } from '@/infrastructure/auth/repositories/InMemoryUserRepository';

// Register interfaces with implementations
container.register<UserRepository>('UserRepository', {
  useClass: InMemoryUserRepository,
});

container.register<OAuthService>('OAuthService', {
  useClass: GoogleOAuthAdapter,
});

container.register<AdminAccessPolicyService>('AdminAccessPolicyService', {
  useFactory: () => new AdminAccessPolicy(process.env.ADMIN_EMAIL || ''),
});

// Register application services
container.register<IAuthenticateUser>('IAuthenticateUser', {
  useClass: AuthenticateUser,
});
container.register<IAuthorizeAdminAccess>('IAuthorizeAdminAccess', {
  useClass: AuthorizeAdminAccess,
});

// Service locator pattern for server components
export class AuthServiceLocator {
  static getAuthorizeAdminAccess(): IAuthorizeAdminAccess {
    return container.resolve('IAuthorizeAdminAccess');
  }

  static getAuthenticateUser(): IAuthenticateUser {
    return container.resolve('IAuthenticateUser');
  }
}

export { container };
