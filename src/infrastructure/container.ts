import 'reflect-metadata';
import { container } from 'tsyringe';
import type { AdminAccessPolicyService } from '@/domain/auth/services/AdminAccessPolicyService';
import type { IBetterAuthClientService } from '@/application/auth/services/IBetterAuthClientService';
import type { IAuthorizeAdminAccess } from '@/application/auth/IAuthorizeAdminAccess';
import type { ILogger } from '@/application/shared/ILogger';
import { UnifiedLogger } from '@/application/shared/UnifiedLogger';
import { FileLoggerAdapter } from '@/infrastructure/shared/adapters/FileLoggerAdapter';
import { LogFormatterService } from '@/domain/shared/services/LogFormatterService';
import { AdminAccessPolicy } from '@/domain/auth/value-objects/AdminAccessPolicy';
import { AuthorizeAdminAccess } from '@/application/auth/AuthorizeAdminAccess';
import { BetterAuthClientAdapter } from '@/infrastructure/auth/adapters/BetterAuthClientAdapter';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import type { SocialNetworkRepository } from '@/domain/settings/repositories/SocialNetworkRepository';
import type { IUpdateWebsiteName } from '@/application/settings/IUpdateWebsiteName';
import type { IGetWebsiteName } from '@/application/settings/IGetWebsiteName';
import type { IUpdateWebsiteIcon } from '@/application/settings/IUpdateWebsiteIcon';
import type { IGetWebsiteIcon } from '@/application/settings/IGetWebsiteIcon';
import type { IGetSocialNetworks } from '@/application/settings/IGetSocialNetworks';
import type { IUpdateSocialNetworks } from '@/application/settings/IUpdateSocialNetworks';
import { UpdateWebsiteName } from '@/application/settings/UpdateWebsiteName';
import { GetWebsiteName } from '@/application/settings/GetWebsiteName';
import { UpdateWebsiteIcon } from '@/application/settings/UpdateWebsiteIcon';
import { GetWebsiteIcon } from '@/application/settings/GetWebsiteIcon';
import { GetSocialNetworks } from '@/application/settings/GetSocialNetworks';
import { UpdateSocialNetworks } from '@/application/settings/UpdateSocialNetworks';
import { MongooseWebsiteSettingsRepository } from '@/infrastructure/settings/repositories/MongooseWebsiteSettingsRepository';
import { MongooseSocialNetworkRepository } from '@/infrastructure/settings/repositories/MongooseSocialNetworkRepository';

// Register simple logger to avoid circular dependencies
container.register<ILogger>('ILogger', {
  useFactory: () => {
    const formatter = new LogFormatterService();
    return new FileLoggerAdapter(formatter);
  },
});

// Register unified logger
container.register<UnifiedLogger>('UnifiedLogger', {
  useFactory: () => {
    const baseLogger = container.resolve<ILogger>('ILogger');
    return new UnifiedLogger(baseLogger);
  },
});

// Register auth services
container.register<IBetterAuthClientService>('IBetterAuthClientService', {
  useClass: BetterAuthClientAdapter,
});

container.register<AdminAccessPolicyService>('AdminAccessPolicyService', {
  useFactory: () => new AdminAccessPolicy(process.env.ADMIN_EMAIL || ''),
});

// Register application services
container.register<IAuthorizeAdminAccess>('IAuthorizeAdminAccess', {
  useClass: AuthorizeAdminAccess,
});

// Register settings services
container.register<WebsiteSettingsRepository>('WebsiteSettingsRepository', {
  useClass: MongooseWebsiteSettingsRepository,
});

container.register<SocialNetworkRepository>('SocialNetworkRepository', {
  useClass: MongooseSocialNetworkRepository,
});

container.register<IUpdateWebsiteName>('IUpdateWebsiteName', {
  useClass: UpdateWebsiteName,
});

container.register<IGetWebsiteName>('IGetWebsiteName', {
  useClass: GetWebsiteName,
});

container.register<IUpdateWebsiteIcon>('IUpdateWebsiteIcon', {
  useClass: UpdateWebsiteIcon,
});

container.register<IGetWebsiteIcon>('IGetWebsiteIcon', {
  useClass: GetWebsiteIcon,
});

container.register<IGetSocialNetworks>('IGetSocialNetworks', {
  useClass: GetSocialNetworks,
});

container.register<IUpdateSocialNetworks>('IUpdateSocialNetworks', {
  useClass: UpdateSocialNetworks,
});

// Service locator pattern for server components
export class AuthServiceLocator {
  static getAuthorizeAdminAccess(): IAuthorizeAdminAccess {
    return container.resolve('IAuthorizeAdminAccess');
  }
}

export class SettingsServiceLocator {
  static getUpdateWebsiteName(): IUpdateWebsiteName {
    return container.resolve('IUpdateWebsiteName');
  }

  static getWebsiteName(): IGetWebsiteName {
    return container.resolve('IGetWebsiteName');
  }

  static getUpdateWebsiteIcon(): IUpdateWebsiteIcon {
    return container.resolve('IUpdateWebsiteIcon');
  }

  static getWebsiteIcon(): IGetWebsiteIcon {
    return container.resolve('IGetWebsiteIcon');
  }

  static getSocialNetworks(): IGetSocialNetworks {
    return container.resolve('IGetSocialNetworks');
  }

  static getUpdateSocialNetworks(): IUpdateSocialNetworks {
    return container.resolve('IUpdateSocialNetworks');
  }
}

export class LoggerServiceLocator {
  static getUnifiedLogger(): UnifiedLogger {
    return container.resolve('UnifiedLogger');
  }

  static getLogger(): ILogger {
    return container.resolve('ILogger');
  }
}

export { container };
