import 'reflect-metadata';

// Safeguard to ensure reflect-metadata is properly initialized across all module contexts
// This addresses potential timing issues in Next.js API route module loading
if (typeof Reflect.hasMetadata !== 'function') {
  try {
    // Attempt dynamic import if metadata system isn't properly initialized
    void import('reflect-metadata');
  } catch {
    // Fallback - continue without metadata if import fails
    // This should not happen in normal circumstances
  }
}

import { container } from 'tsyringe';
import type { AdminAccessPolicyService } from '@/domain/auth/services/AdminAccessPolicyService';
import type { IBetterAuthClientService } from '@/application/auth/services/IBetterAuthClientService';
import type { IAuthorizeAdminAccess } from '@/application/auth/IAuthorizeAdminAccess';
import type { ILogger } from '@/application/shared/ILogger';
import { Logger } from '@/application/shared/Logger';
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
import type { IGetConfiguredSocialNetworks } from '@/application/settings/IGetConfiguredSocialNetworks';
import type { IGetThemeColor } from '@/application/settings/IGetThemeColor';
import type { IUpdateThemeColor } from '@/application/settings/IUpdateThemeColor';
import type { IGetHeaderLogo } from '@/application/settings/IGetHeaderLogo';
import type { IUpdateHeaderLogo } from '@/application/settings/IUpdateHeaderLogo';
import { UpdateWebsiteName } from '@/application/settings/UpdateWebsiteName';
import { GetWebsiteName } from '@/application/settings/GetWebsiteName';
import { UpdateWebsiteIcon } from '@/application/settings/UpdateWebsiteIcon';
import { GetWebsiteIcon } from '@/application/settings/GetWebsiteIcon';
import { GetSocialNetworks } from '@/application/settings/GetSocialNetworks';
import { UpdateSocialNetworks } from '@/application/settings/UpdateSocialNetworks';
import { GetConfiguredSocialNetworks } from '@/application/settings/GetConfiguredSocialNetworks';
import { GetThemeColor } from '@/application/settings/GetThemeColor';
import { UpdateThemeColor } from '@/application/settings/UpdateThemeColor';
import { GetHeaderLogo } from '@/application/settings/GetHeaderLogo';
import { UpdateHeaderLogo } from '@/application/settings/UpdateHeaderLogo';
import { MongooseWebsiteSettingsRepository } from '@/infrastructure/settings/repositories/MongooseWebsiteSettingsRepository';
import { MongooseSocialNetworkRepository } from '@/infrastructure/settings/repositories/MongooseSocialNetworkRepository';
import { SocialNetworkFactory } from '@/application/settings/SocialNetworkFactory';
import { SocialNetworkValidationService } from '@/domain/settings/services/SocialNetworkValidationService';
import { SocialNetworkUrlNormalizationService } from '@/domain/settings/services/SocialNetworkUrlNormalizationService';
import type { ISocialNetworkUrlNormalizationService } from '@/domain/settings/services/ISocialNetworkUrlNormalizationService';
import type { MenuItemRepository } from '@/domain/menu/repositories/MenuItemRepository';
import type { IGetMenuItems } from '@/application/menu/IGetMenuItems';
import type { IAddMenuItem } from '@/application/menu/IAddMenuItem';
import type { IRemoveMenuItem } from '@/application/menu/IRemoveMenuItem';
import type { IReorderMenuItems } from '@/application/menu/IReorderMenuItems';
import type { IUpdateMenuItem } from '@/application/menu/IUpdateMenuItem';
import { MongooseMenuItemRepository } from '@/infrastructure/menu/repositories/MongooseMenuItemRepository';
import { GetMenuItems } from '@/application/menu/GetMenuItems';
import { AddMenuItem } from '@/application/menu/AddMenuItem';
import { RemoveMenuItem } from '@/application/menu/RemoveMenuItem';
import { ReorderMenuItems } from '@/application/menu/ReorderMenuItems';
import { UpdateMenuItem } from '@/application/menu/UpdateMenuItem';

// Register unified logger
container.register<Logger>('Logger', {
  useFactory: () => new Logger(),
});

// Register ILogger interface for backward compatibility
container.register<ILogger>('ILogger', {
  useFactory: () => container.resolve<Logger>('Logger'),
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

container.register<IGetConfiguredSocialNetworks>(
  'IGetConfiguredSocialNetworks',
  {
    useClass: GetConfiguredSocialNetworks,
  }
);

container.register<IGetThemeColor>('IGetThemeColor', {
  useClass: GetThemeColor,
});

container.register<IUpdateThemeColor>('IUpdateThemeColor', {
  useClass: UpdateThemeColor,
});

container.register<IGetHeaderLogo>('IGetHeaderLogo', {
  useClass: GetHeaderLogo,
});

container.register<IUpdateHeaderLogo>('IUpdateHeaderLogo', {
  useClass: UpdateHeaderLogo,
});

// Register factory services
container.register<SocialNetworkFactory>('SocialNetworkFactory', {
  useClass: SocialNetworkFactory,
});

// Register validation services
container.register<SocialNetworkValidationService>(
  'SocialNetworkValidationService',
  {
    useFactory: () => {
      const logger = container.resolve<Logger>('Logger');
      return new SocialNetworkValidationService(logger);
    },
  }
);

// Register URL normalization service
container.register<ISocialNetworkUrlNormalizationService>(
  'ISocialNetworkUrlNormalizationService',
  {
    useFactory: () => {
      const logger = container.resolve<Logger>('Logger');
      return new SocialNetworkUrlNormalizationService(logger);
    },
  }
);

// Register menu services
container.register<MenuItemRepository>('MenuItemRepository', {
  useClass: MongooseMenuItemRepository,
});

container.register<IGetMenuItems>('IGetMenuItems', {
  useClass: GetMenuItems,
});

container.register<IAddMenuItem>('IAddMenuItem', {
  useClass: AddMenuItem,
});

container.register<IRemoveMenuItem>('IRemoveMenuItem', {
  useClass: RemoveMenuItem,
});

container.register<IReorderMenuItems>('IReorderMenuItems', {
  useClass: ReorderMenuItems,
});

container.register<IUpdateMenuItem>('IUpdateMenuItem', {
  useClass: UpdateMenuItem,
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

  static getConfiguredSocialNetworks(): IGetConfiguredSocialNetworks {
    return container.resolve('IGetConfiguredSocialNetworks');
  }

  static getGetThemeColor(): IGetThemeColor {
    return container.resolve('IGetThemeColor');
  }

  static getUpdateThemeColor(): IUpdateThemeColor {
    return container.resolve('IUpdateThemeColor');
  }

  static getHeaderLogo(): IGetHeaderLogo {
    return container.resolve('IGetHeaderLogo');
  }

  static getUpdateHeaderLogo(): IUpdateHeaderLogo {
    return container.resolve('IUpdateHeaderLogo');
  }
}

export class LoggerServiceLocator {
  static getLogger(): Logger {
    return container.resolve('Logger');
  }

  static getBaseLogger(): ILogger {
    return container.resolve('ILogger');
  }
}

export { container };
