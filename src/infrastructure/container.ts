import 'reflect-metadata';
import { container } from 'tsyringe';
import type { UserRepository } from '@/domain/auth/repositories/UserRepository';
import type { AdminAccessPolicyService } from '@/domain/auth/services/AdminAccessPolicyService';
import type { OAuthService } from '@/application/auth/services/OAuthService';
import type { IAuthenticateUser } from '@/application/auth/IAuthenticateUser';
import type { IAuthorizeAdminAccess } from '@/application/auth/IAuthorizeAdminAccess';
import type { ILogger } from '@/application/shared/ILogger';
import { AdminAccessPolicy } from '@/domain/auth/value-objects/AdminAccessPolicy';
import { AuthenticateUser } from '@/application/auth/AuthenticateUser';
import { AuthorizeAdminAccess } from '@/application/auth/AuthorizeAdminAccess';
import { GoogleOAuthAdapter } from '@/infrastructure/auth/adapters/GoogleOAuthAdapter';
import { InMemoryUserRepository } from '@/infrastructure/auth/repositories/InMemoryUserRepository';
import { FileLoggerAdapter } from '@/infrastructure/shared/adapters/FileLoggerAdapter';
import { LogFormatterService } from '@/domain/shared/services/LogFormatterService';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import type { IUpdateWebsiteName } from '@/application/settings/IUpdateWebsiteName';
import type { IGetWebsiteName } from '@/application/settings/IGetWebsiteName';
import { UpdateWebsiteName } from '@/application/settings/UpdateWebsiteName';
import { GetWebsiteName } from '@/application/settings/GetWebsiteName';
import { MongooseWebsiteSettingsRepository } from '@/infrastructure/settings/repositories/MongooseWebsiteSettingsRepository';

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

// Register logger
container.register<ILogger>('ILogger', {
  useFactory: () => new FileLoggerAdapter(new LogFormatterService()),
});

// Register settings services
container.register<WebsiteSettingsRepository>('WebsiteSettingsRepository', {
  useClass: MongooseWebsiteSettingsRepository,
});

container.register<IUpdateWebsiteName>('IUpdateWebsiteName', {
  useClass: UpdateWebsiteName,
});

container.register<IGetWebsiteName>('IGetWebsiteName', {
  useClass: GetWebsiteName,
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

export class SettingsServiceLocator {
  static getUpdateWebsiteName(): IUpdateWebsiteName {
    return container.resolve('IUpdateWebsiteName');
  }

  static getWebsiteName(): IGetWebsiteName {
    return container.resolve('IGetWebsiteName');
  }
}

export { container };
