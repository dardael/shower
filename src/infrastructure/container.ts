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
import type { IGetBackgroundColor } from '@/application/settings/IGetBackgroundColor';
import type { IUpdateBackgroundColor } from '@/application/settings/IUpdateBackgroundColor';
import type { IGetHeaderLogo } from '@/application/settings/IGetHeaderLogo';
import type { IUpdateHeaderLogo } from '@/application/settings/IUpdateHeaderLogo';
import type { IGetWebsiteFont } from '@/application/settings/IGetWebsiteFont';
import type { IUpdateWebsiteFont } from '@/application/settings/IUpdateWebsiteFont';
import type { IGetAvailableFonts } from '@/application/settings/IGetAvailableFonts';
import type { IGetThemeMode } from '@/application/settings/IGetThemeMode';
import type { IUpdateThemeMode } from '@/application/settings/IUpdateThemeMode';
import type { IGetSellingEnabled } from '@/application/settings/IGetSellingEnabled';
import type { IUpdateSellingEnabled } from '@/application/settings/IUpdateSellingEnabled';
import { UpdateWebsiteName } from '@/application/settings/UpdateWebsiteName';
import { GetWebsiteName } from '@/application/settings/GetWebsiteName';
import { UpdateWebsiteIcon } from '@/application/settings/UpdateWebsiteIcon';
import { GetWebsiteIcon } from '@/application/settings/GetWebsiteIcon';
import { GetSocialNetworks } from '@/application/settings/GetSocialNetworks';
import { UpdateSocialNetworks } from '@/application/settings/UpdateSocialNetworks';
import { GetConfiguredSocialNetworks } from '@/application/settings/GetConfiguredSocialNetworks';
import { GetThemeColor } from '@/application/settings/GetThemeColor';
import { UpdateThemeColor } from '@/application/settings/UpdateThemeColor';
import { GetBackgroundColor } from '@/application/settings/GetBackgroundColor';
import { UpdateBackgroundColor } from '@/application/settings/UpdateBackgroundColor';
import { GetHeaderLogo } from '@/application/settings/GetHeaderLogo';
import { UpdateHeaderLogo } from '@/application/settings/UpdateHeaderLogo';
import { GetWebsiteFont } from '@/application/settings/GetWebsiteFont';
import { UpdateWebsiteFont } from '@/application/settings/UpdateWebsiteFont';
import { GetAvailableFonts } from '@/application/settings/GetAvailableFonts';
import { GetThemeMode } from '@/application/settings/GetThemeMode';
import { UpdateThemeMode } from '@/application/settings/UpdateThemeMode';
import { GetSellingEnabled } from '@/application/settings/GetSellingEnabled';
import { UpdateSellingEnabled } from '@/application/settings/UpdateSellingEnabled';
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
import type { IPageContentRepository } from '@/domain/pages/repositories/IPageContentRepository';
import { MongoosePageContentRepository } from '@/infrastructure/pages/repositories/MongoosePageContentRepository';
import type { IFileStorageService } from '@/infrastructure/shared/services/FileStorageService';
import { LocalFileStorageService } from '@/infrastructure/shared/services/FileStorageService';
import type { ICreatePageContent } from '@/application/pages/interfaces/ICreatePageContent';
import type { IGetPageContent } from '@/application/pages/interfaces/IGetPageContent';
import type { IUpdatePageContent } from '@/application/pages/interfaces/IUpdatePageContent';
import type { IDeletePageContent } from '@/application/pages/interfaces/IDeletePageContent';
import { CreatePageContent } from '@/application/pages/use-cases/CreatePageContent';
import { GetPageContent } from '@/application/pages/use-cases/GetPageContent';
import { UpdatePageContent } from '@/application/pages/use-cases/UpdatePageContent';
import { DeletePageContent } from '@/application/pages/use-cases/DeletePageContent';
import type { IScheduledRestartConfigRepository } from '@/domain/config/repositories/IScheduledRestartConfigRepository';
import { MongooseScheduledRestartConfigRepository } from '@/infrastructure/config/repositories/MongooseScheduledRestartConfigRepository';
import type { IGetScheduledRestartConfig } from '@/application/config/IGetScheduledRestartConfig';
import type { IUpdateScheduledRestartConfig } from '@/application/config/IUpdateScheduledRestartConfig';
import { GetScheduledRestartConfig } from '@/application/config/GetScheduledRestartConfig';
import { UpdateScheduledRestartConfig } from '@/application/config/UpdateScheduledRestartConfig';
import type { IRestartScheduler } from '@/domain/config/services/IRestartScheduler';
import { NodeCronRestartScheduler } from '@/infrastructure/config/services/NodeCronRestartScheduler';
import type { IProductRepository } from '@/domain/product/repositories/IProductRepository';
import type { ICategoryRepository } from '@/domain/product/repositories/ICategoryRepository';
import { MongooseProductRepository } from '@/infrastructure/product/repositories/MongooseProductRepository';
import { MongooseCategoryRepository } from '@/infrastructure/product/repositories/MongooseCategoryRepository';
import type { ICreateProduct } from '@/application/product/ICreateProduct';
import type { IUpdateProduct } from '@/application/product/IUpdateProduct';
import type { IDeleteProduct } from '@/application/product/IDeleteProduct';
import type { IGetProducts } from '@/application/product/IGetProducts';
import type { IReorderProducts } from '@/application/product/IReorderProducts';
import type { ICreateCategory } from '@/application/product/ICreateCategory';
import type { IUpdateCategory } from '@/application/product/IUpdateCategory';
import type { IDeleteCategory } from '@/application/product/IDeleteCategory';
import type { IGetCategories } from '@/application/product/IGetCategories';
import type { IReorderCategories } from '@/application/product/IReorderCategories';
import { CreateProduct } from '@/application/product/CreateProduct';
import { UpdateProduct } from '@/application/product/UpdateProduct';
import { DeleteProduct } from '@/application/product/DeleteProduct';
import { GetProducts } from '@/application/product/GetProducts';
import { ReorderProducts } from '@/application/product/ReorderProducts';
import { CreateCategory } from '@/application/product/CreateCategory';
import { UpdateCategory } from '@/application/product/UpdateCategory';
import { DeleteCategory } from '@/application/product/DeleteCategory';
import { GetCategories } from '@/application/product/GetCategories';
import { ReorderCategories } from '@/application/product/ReorderCategories';
import type { IGetPublicProducts } from '@/application/product/IGetPublicProducts';
import { GetPublicProducts } from '@/application/product/GetPublicProducts';
import type { IOrderRepository } from '@/domain/order/repositories/IOrderRepository';
import { MongooseOrderRepository } from '@/infrastructure/order/repositories/MongooseOrderRepository';

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

// Register file storage service
container.register<IFileStorageService>('IFileStorageService', {
  useClass: LocalFileStorageService,
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

container.register<IGetBackgroundColor>('IGetBackgroundColor', {
  useClass: GetBackgroundColor,
});

container.register<IUpdateBackgroundColor>('IUpdateBackgroundColor', {
  useClass: UpdateBackgroundColor,
});

container.register<IGetHeaderLogo>('IGetHeaderLogo', {
  useClass: GetHeaderLogo,
});

container.register<IUpdateHeaderLogo>('IUpdateHeaderLogo', {
  useClass: UpdateHeaderLogo,
});

container.register<IGetWebsiteFont>('IGetWebsiteFont', {
  useClass: GetWebsiteFont,
});

container.register<IUpdateWebsiteFont>('IUpdateWebsiteFont', {
  useClass: UpdateWebsiteFont,
});

container.register<IGetAvailableFonts>('IGetAvailableFonts', {
  useClass: GetAvailableFonts,
});

container.register<IGetThemeMode>('IGetThemeMode', {
  useClass: GetThemeMode,
});

container.register<IUpdateThemeMode>('IUpdateThemeMode', {
  useClass: UpdateThemeMode,
});

container.register<IGetSellingEnabled>('IGetSellingEnabled', {
  useClass: GetSellingEnabled,
});

container.register<IUpdateSellingEnabled>('IUpdateSellingEnabled', {
  useClass: UpdateSellingEnabled,
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

// Register page content services
container.register<IPageContentRepository>('PageContentRepository', {
  useClass: MongoosePageContentRepository,
});

container.register<ICreatePageContent>('ICreatePageContent', {
  useClass: CreatePageContent,
});

container.register<IGetPageContent>('IGetPageContent', {
  useClass: GetPageContent,
});

container.register<IUpdatePageContent>('IUpdatePageContent', {
  useClass: UpdatePageContent,
});

container.register<IDeletePageContent>('IDeletePageContent', {
  useClass: DeletePageContent,
});

// Register scheduled restart config services
container.register<IScheduledRestartConfigRepository>(
  'IScheduledRestartConfigRepository',
  {
    useClass: MongooseScheduledRestartConfigRepository,
  }
);

container.register<IGetScheduledRestartConfig>('IGetScheduledRestartConfig', {
  useClass: GetScheduledRestartConfig,
});

container.register<IUpdateScheduledRestartConfig>(
  'IUpdateScheduledRestartConfig',
  {
    useClass: UpdateScheduledRestartConfig,
  }
);

container.register<IRestartScheduler>('IRestartScheduler', {
  useClass: NodeCronRestartScheduler,
});

// Register product services
container.register<IProductRepository>('IProductRepository', {
  useClass: MongooseProductRepository,
});

container.register<ICategoryRepository>('ICategoryRepository', {
  useClass: MongooseCategoryRepository,
});

// Register product use cases
container.register<ICreateProduct>('ICreateProduct', {
  useClass: CreateProduct,
});

container.register<IUpdateProduct>('IUpdateProduct', {
  useClass: UpdateProduct,
});

container.register<IDeleteProduct>('IDeleteProduct', {
  useClass: DeleteProduct,
});

container.register<IGetProducts>('IGetProducts', {
  useClass: GetProducts,
});

container.register<IReorderProducts>('IReorderProducts', {
  useClass: ReorderProducts,
});

// Register category use cases
container.register<ICreateCategory>('ICreateCategory', {
  useClass: CreateCategory,
});

container.register<IUpdateCategory>('IUpdateCategory', {
  useClass: UpdateCategory,
});

container.register<IDeleteCategory>('IDeleteCategory', {
  useClass: DeleteCategory,
});

container.register<IGetCategories>('IGetCategories', {
  useClass: GetCategories,
});

container.register<IReorderCategories>('IReorderCategories', {
  useClass: ReorderCategories,
});

// Register public product use case
container.register<IGetPublicProducts>('IGetPublicProducts', {
  useClass: GetPublicProducts,
});

// Register order services
container.register<IOrderRepository>('IOrderRepository', {
  useClass: MongooseOrderRepository,
});

// Service locator pattern for server components
export class AuthServiceLocator {
  static getAuthorizeAdminAccess(): IAuthorizeAdminAccess {
    return container.resolve('IAuthorizeAdminAccess');
  }
}

export class SettingsServiceLocator {
  static getWebsiteSettingsRepository(): WebsiteSettingsRepository {
    return container.resolve('WebsiteSettingsRepository');
  }

  static getSocialNetworkRepository(): SocialNetworkRepository {
    return container.resolve('SocialNetworkRepository');
  }

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

  static getGetBackgroundColor(): IGetBackgroundColor {
    return container.resolve('IGetBackgroundColor');
  }

  static getUpdateBackgroundColor(): IUpdateBackgroundColor {
    return container.resolve('IUpdateBackgroundColor');
  }

  static getHeaderLogo(): IGetHeaderLogo {
    return container.resolve('IGetHeaderLogo');
  }

  static getUpdateHeaderLogo(): IUpdateHeaderLogo {
    return container.resolve('IUpdateHeaderLogo');
  }

  static getGetWebsiteFont(): IGetWebsiteFont {
    return container.resolve('IGetWebsiteFont');
  }

  static getUpdateWebsiteFont(): IUpdateWebsiteFont {
    return container.resolve('IUpdateWebsiteFont');
  }

  static getGetAvailableFonts(): IGetAvailableFonts {
    return container.resolve('IGetAvailableFonts');
  }

  static getGetThemeMode(): IGetThemeMode {
    return container.resolve('IGetThemeMode');
  }

  static getUpdateThemeMode(): IUpdateThemeMode {
    return container.resolve('IUpdateThemeMode');
  }

  static getGetSellingEnabled(): IGetSellingEnabled {
    return container.resolve('IGetSellingEnabled');
  }

  static getUpdateSellingEnabled(): IUpdateSellingEnabled {
    return container.resolve('IUpdateSellingEnabled');
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

export class MenuServiceLocator {
  static getMenuItemRepository(): MenuItemRepository {
    return container.resolve('MenuItemRepository');
  }

  static getGetMenuItems(): IGetMenuItems {
    return container.resolve('IGetMenuItems');
  }

  static getAddMenuItem(): IAddMenuItem {
    return container.resolve('IAddMenuItem');
  }

  static getRemoveMenuItem(): IRemoveMenuItem {
    return container.resolve('IRemoveMenuItem');
  }

  static getReorderMenuItems(): IReorderMenuItems {
    return container.resolve('IReorderMenuItems');
  }

  static getUpdateMenuItem(): IUpdateMenuItem {
    return container.resolve('IUpdateMenuItem');
  }
}

export class PagesServiceLocator {
  static getPageContentRepository(): IPageContentRepository {
    return container.resolve('PageContentRepository');
  }

  static getCreatePageContent(): ICreatePageContent {
    return container.resolve('ICreatePageContent');
  }

  static getGetPageContent(): IGetPageContent {
    return container.resolve('IGetPageContent');
  }

  static getUpdatePageContent(): IUpdatePageContent {
    return container.resolve('IUpdatePageContent');
  }

  static getDeletePageContent(): IDeletePageContent {
    return container.resolve('IDeletePageContent');
  }
}

export class ConfigServiceLocator {
  static getGetScheduledRestartConfig(): IGetScheduledRestartConfig {
    return container.resolve('IGetScheduledRestartConfig');
  }

  static getUpdateScheduledRestartConfig(): IUpdateScheduledRestartConfig {
    return container.resolve('IUpdateScheduledRestartConfig');
  }

  static getRestartScheduler(): IRestartScheduler {
    return container.resolve('IRestartScheduler');
  }
}

export class ProductServiceLocator {
  static getProductRepository(): IProductRepository {
    return container.resolve('IProductRepository');
  }

  static getCategoryRepository(): ICategoryRepository {
    return container.resolve('ICategoryRepository');
  }

  static getCreateProduct(): ICreateProduct {
    return container.resolve('ICreateProduct');
  }

  static getUpdateProduct(): IUpdateProduct {
    return container.resolve('IUpdateProduct');
  }

  static getDeleteProduct(): IDeleteProduct {
    return container.resolve('IDeleteProduct');
  }

  static getGetProducts(): IGetProducts {
    return container.resolve('IGetProducts');
  }

  static getReorderProducts(): IReorderProducts {
    return container.resolve('IReorderProducts');
  }

  static getCreateCategory(): ICreateCategory {
    return container.resolve('ICreateCategory');
  }

  static getUpdateCategory(): IUpdateCategory {
    return container.resolve('IUpdateCategory');
  }

  static getDeleteCategory(): IDeleteCategory {
    return container.resolve('IDeleteCategory');
  }

  static getGetCategories(): IGetCategories {
    return container.resolve('IGetCategories');
  }

  static getReorderCategories(): IReorderCategories {
    return container.resolve('IReorderCategories');
  }

  static getGetPublicProducts(): IGetPublicProducts {
    return container.resolve('IGetPublicProducts');
  }
}

export class OrderServiceLocator {
  static getOrderRepository(): IOrderRepository {
    return container.resolve('IOrderRepository');
  }
}

export { container };
