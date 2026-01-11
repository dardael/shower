import AdmZip from 'adm-zip';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  IConfigurationImporter,
  ImportResult,
  ImportValidationResult,
} from '@/domain/config/ports/IConfigurationImporter';
import { ILogger } from '@/application/shared/ILogger';
import { MenuItemRepository } from '@/domain/menu/repositories/MenuItemRepository';
import { IPageContentRepository } from '@/domain/pages/repositories/IPageContentRepository';
import { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { SocialNetworkRepository } from '@/domain/settings/repositories/SocialNetworkRepository';
import { IProductRepository } from '@/domain/product/repositories/IProductRepository';
import { ICategoryRepository } from '@/domain/product/repositories/ICategoryRepository';
import { IActivityRepository } from '@/domain/appointment/repositories/IActivityRepository';
import { IAvailabilityRepository } from '@/domain/appointment/repositories/IAvailabilityRepository';
import { MenuItem } from '@/domain/menu/entities/MenuItem';
import { MenuItemText } from '@/domain/menu/value-objects/MenuItemText';
import { MenuItemUrl } from '@/domain/menu/value-objects/MenuItemUrl';
import { PageContent } from '@/domain/pages/entities/PageContent';
import { PageContentBody } from '@/domain/pages/value-objects/PageContentBody';
import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import { Product } from '@/domain/product/entities/Product';
import { Category } from '@/domain/product/entities/Category';
import { Activity } from '@/domain/appointment/entities/Activity';
import { Availability } from '@/domain/appointment/entities/Availability';
import { WeeklySlot } from '@/domain/appointment/value-objects/WeeklySlot';
import { AvailabilityException } from '@/domain/appointment/value-objects/AvailabilityException';
import { RequiredFieldsConfig } from '@/domain/appointment/value-objects/RequiredFieldsConfig';
import { ReminderSettings } from '@/domain/appointment/value-objects/ReminderSettings';
import { PackageVersion } from '@/domain/config/value-objects/PackageVersion';
import { ExportPackage } from '@/domain/config/entities/ExportPackage';
import { IIconMetadata } from '@/domain/settings/types/IconMetadata';
import { ICustomLoaderMetadata } from '@/domain/settings/entities/WebsiteSetting';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';
import { getApiUrl } from '@/infrastructure/shared/utils/appUrl';
import type {
  SerializedMenuItem,
  SerializedPageContent,
  SerializedSetting,
  SerializedSocialNetwork,
  SerializedProduct,
  SerializedCategory,
  SerializedActivity,
  SerializedAvailability,
} from '@/infrastructure/config/types/SerializedTypes';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'page-content-images');
const ICONS_DIR = path.join(process.cwd(), 'public', 'icons');
const LOADERS_DIR = path.join(process.cwd(), 'public', 'loaders');
const PRODUCT_IMAGES_DIR = path.join(process.cwd(), 'public', 'product-images');

export class ZipImporter implements IConfigurationImporter {
  constructor(
    private readonly menuItemRepository: MenuItemRepository,
    private readonly pageContentRepository: IPageContentRepository,
    private readonly websiteSettingsRepository: WebsiteSettingsRepository,
    private readonly socialNetworkRepository: SocialNetworkRepository,
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly activityRepository: IActivityRepository,
    private readonly availabilityRepository: IAvailabilityRepository,
    private readonly logger: ILogger
  ) {}

  async validatePackage(zipBuffer: Buffer): Promise<ImportValidationResult> {
    try {
      const zip = new AdmZip(zipBuffer);
      const manifestEntry = zip.getEntry('manifest.json');

      if (!manifestEntry) {
        return {
          valid: false,
          error: 'Package invalide : manifest.json manquant',
        };
      }

      const manifestData = JSON.parse(manifestEntry.getData().toString('utf8'));
      const packageVersion = PackageVersion.fromString(
        manifestData.schemaVersion
      );
      const currentVersion = PackageVersion.CURRENT;

      if (!packageVersion.isCompatibleWith(currentVersion)) {
        return {
          valid: false,
          error: `Version de package incompatible : ${packageVersion.toString()}. Version actuelle : ${currentVersion.toString()}`,
        };
      }

      const exportPackage = ExportPackage.fromManifest(manifestData);

      return {
        valid: true,
        package: exportPackage,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Format de package invalide';
      return { valid: false, error: errorMessage };
    }
  }

  async importFromZip(zipBuffer: Buffer): Promise<ImportResult> {
    this.logger.logInfo('Starting configuration import');

    try {
      const zip = new AdmZip(zipBuffer);

      // Validate manifest
      const validation = await this.validatePackage(zipBuffer);
      if (!validation.valid || !validation.package) {
        return {
          success: false,
          error: validation.error ?? 'Package invalide',
        };
      }

      this.logger.logInfo(
        `Importing package from ${validation.package.exportDate.toISOString()}`
      );

      // Clear existing data
      await this.clearExistingData();

      // Import menu items
      const menuItemsCount = await this.importMenuItems(zip);

      // Import page contents
      const pageContentsCount = await this.importPageContents(zip);

      // Import settings
      const settingsCount = await this.importSettings(zip);

      // Import social networks
      const socialNetworksCount = await this.importSocialNetworks(zip);

      // Import products and categories
      const categoriesCount = await this.importCategories(zip);
      const productsCount = await this.importProducts(zip);

      // Import activities and availability
      const activitiesCount = await this.importActivities(zip);
      const hasAvailability = await this.importAvailability(zip);

      // Import images
      const imagesCount = await this.importImages(zip);

      this.logger.logInfo(
        `Import complete: ${menuItemsCount} menu items, ${pageContentsCount} pages, ${settingsCount} settings, ${socialNetworksCount} social networks, ${productsCount} products, ${categoriesCount} categories, ${activitiesCount} activities, ${imagesCount} images`
      );

      return {
        success: true,
        message: 'Configuration importée avec succès',
        imported: {
          menuItems: menuItemsCount,
          pageContents: pageContentsCount,
          settings: settingsCount,
          socialNetworks: socialNetworksCount,
          products: productsCount,
          categories: categoriesCount,
          activities: activitiesCount,
          hasAvailability,
          images: imagesCount,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur inconnue lors de l'import";
      this.logger.logError(`Import failed: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  private async clearExistingData(): Promise<void> {
    this.logger.logInfo('Clearing existing data');

    // Clear page contents first (before menu items due to potential FK constraints)
    const existingPageContents = await this.pageContentRepository.findAll();
    for (const pageContent of existingPageContents) {
      await this.pageContentRepository.delete(pageContent.menuItemId);
    }

    // Clear menu items
    const existingMenuItems = await this.menuItemRepository.findAll();
    for (const item of existingMenuItems) {
      await this.menuItemRepository.delete(item.id);
    }

    // Clear products
    const existingProducts = await this.productRepository.getAll();
    for (const product of existingProducts) {
      await this.productRepository.delete(product.id);
    }

    // Clear categories
    const existingCategories = await this.categoryRepository.getAll();
    for (const category of existingCategories) {
      await this.categoryRepository.delete(category.id);
    }

    // Clear activities
    const existingActivities = await this.activityRepository.findAll();
    for (const activity of existingActivities) {
      if (activity.id) {
        await this.activityRepository.delete(activity.id);
      }
    }

    // Clear page content images directory
    try {
      const files = await fs.readdir(IMAGES_DIR);
      for (const file of files) {
        await fs.unlink(path.join(IMAGES_DIR, file));
      }
    } catch {
      // Directory doesn't exist, nothing to clear
    }

    // Clear icons directory
    try {
      const files = await fs.readdir(ICONS_DIR);
      for (const file of files) {
        await fs.unlink(path.join(ICONS_DIR, file));
      }
    } catch {
      // Directory doesn't exist, nothing to clear
    }

    // Clear loaders directory
    try {
      const files = await fs.readdir(LOADERS_DIR);
      for (const file of files) {
        if (file !== '.gitkeep') {
          await fs.unlink(path.join(LOADERS_DIR, file));
        }
      }
    } catch {
      // Directory doesn't exist, nothing to clear
    }

    // Clear product images directory
    try {
      const files = await fs.readdir(PRODUCT_IMAGES_DIR);
      for (const file of files) {
        if (file !== '.gitkeep') {
          await fs.unlink(path.join(PRODUCT_IMAGES_DIR, file));
        }
      }
    } catch {
      // Directory doesn't exist, nothing to clear
    }
  }

  private async importMenuItems(zip: AdmZip): Promise<number> {
    const entry = zip.getEntry('data/menu-items.json');
    if (!entry) return 0;

    const items: SerializedMenuItem[] = JSON.parse(
      entry.getData().toString('utf8')
    );

    for (const item of items) {
      const text = MenuItemText.create(item.text);
      // If URL is null, generate a slug from the text
      const urlValue = item.url ?? this.generateSlug(item.text);
      const url = MenuItemUrl.create(urlValue);
      const menuItem = MenuItem.reconstitute(
        item.id,
        text,
        url,
        item.position,
        new Date(item.createdAt),
        new Date(item.updatedAt)
      );
      await this.menuItemRepository.save(menuItem);
    }

    return items.length;
  }

  private async importPageContents(zip: AdmZip): Promise<number> {
    const entry = zip.getEntry('data/page-contents.json');
    if (!entry) return 0;

    const pages: SerializedPageContent[] = JSON.parse(
      entry.getData().toString('utf8')
    );

    for (const page of pages) {
      const content = PageContentBody.create(page.content);
      const pageContent = PageContent.reconstitute(
        page.id,
        page.menuItemId,
        content,
        new Date(page.createdAt),
        new Date(page.updatedAt)
      );
      await this.pageContentRepository.save(pageContent);
    }

    return pages.length;
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async importSettings(zip: AdmZip): Promise<number> {
    const entry = zip.getEntry('data/settings.json');
    if (!entry) return 0;

    const settings: SerializedSetting[] = JSON.parse(
      entry.getData().toString('utf8')
    );

    for (const setting of settings) {
      const updatedValue = this.updateSettingValueUrls(
        setting.key,
        setting.value
      );
      await this.websiteSettingsRepository.setByKey(
        setting.key,
        updatedValue as Parameters<
          typeof this.websiteSettingsRepository.setByKey
        >[1]
      );
    }

    return settings.length;
  }

  private updateSettingValueUrls(
    key: string,
    value: SerializedSetting['value']
  ): SerializedSetting['value'] {
    // Only update URLs for icon/logo settings
    if (
      (key === VALID_SETTING_KEYS.WEBSITE_ICON ||
        key === VALID_SETTING_KEYS.HEADER_LOGO) &&
      value !== null &&
      typeof value === 'object' &&
      'url' in value &&
      'metadata' in value
    ) {
      // Reconstruct the URL using the current environment's base URL
      const metadata = value.metadata as IIconMetadata;
      const newUrl = getApiUrl(`/api/icons/${metadata.filename}`);
      return {
        url: newUrl,
        metadata: value.metadata,
      };
    }

    // Update URLs for custom loader settings
    if (
      key === VALID_SETTING_KEYS.CUSTOM_LOADER &&
      value !== null &&
      typeof value === 'object' &&
      'url' in value &&
      'metadata' in value
    ) {
      const metadata = value.metadata as ICustomLoaderMetadata;
      const newUrl = getApiUrl(`/api/loaders/${metadata.filename}`);
      return {
        url: newUrl,
        metadata: value.metadata,
      };
    }

    return value;
  }

  private parseSocialNetworkType(typeString: string): SocialNetworkType {
    const typeMap: Record<string, SocialNetworkType> = {
      facebook: SocialNetworkType.FACEBOOK,
      instagram: SocialNetworkType.INSTAGRAM,
      linkedin: SocialNetworkType.LINKEDIN,
      email: SocialNetworkType.EMAIL,
      phone: SocialNetworkType.PHONE,
    };
    return typeMap[typeString.toLowerCase()] ?? SocialNetworkType.FACEBOOK;
  }

  private async importSocialNetworks(zip: AdmZip): Promise<number> {
    const entry = zip.getEntry('data/social-networks.json');
    if (!entry) return 0;

    const networks: SerializedSocialNetwork[] = JSON.parse(
      entry.getData().toString('utf8')
    );

    const socialNetworks: SocialNetwork[] = networks.map((network) => {
      const type = this.parseSocialNetworkType(network.type);
      return SocialNetwork.create(
        type,
        network.url,
        network.label,
        network.enabled
      );
    });

    await this.socialNetworkRepository.updateSocialNetworks(socialNetworks);

    return networks.length;
  }

  private async importProducts(zip: AdmZip): Promise<number> {
    const entry = zip.getEntry('data/products.json');
    if (!entry) return 0;

    const products: SerializedProduct[] = JSON.parse(
      entry.getData().toString('utf8')
    );

    for (const productData of products) {
      const product = Product.fromJSON({
        id: productData.id,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        imageUrl: productData.imageUrl,
        displayOrder: productData.displayOrder,
        categoryIds: productData.categoryIds,
        createdAt: new Date(productData.createdAt),
        updatedAt: new Date(productData.updatedAt),
      });
      await this.productRepository.create(product);
    }

    return products.length;
  }

  private async importCategories(zip: AdmZip): Promise<number> {
    const entry = zip.getEntry('data/categories.json');
    if (!entry) return 0;

    const categories: SerializedCategory[] = JSON.parse(
      entry.getData().toString('utf8')
    );

    for (const categoryData of categories) {
      const category = Category.fromJSON({
        id: categoryData.id,
        name: categoryData.name,
        description: categoryData.description,
        displayOrder: categoryData.displayOrder,
        createdAt: new Date(categoryData.createdAt),
        updatedAt: new Date(categoryData.updatedAt),
      });
      await this.categoryRepository.create(category);
    }

    return categories.length;
  }

  private async importActivities(zip: AdmZip): Promise<number> {
    const entry = zip.getEntry('data/activities.json');
    if (!entry) return 0;

    const activities: SerializedActivity[] = JSON.parse(
      entry.getData().toString('utf8')
    );

    for (const activityData of activities) {
      const requiredFields = RequiredFieldsConfig.create({
        fields: activityData.requiredFields.fields as (
          | 'name'
          | 'email'
          | 'phone'
          | 'address'
          | 'custom'
        )[],
        customFieldLabel: activityData.requiredFields.customFieldLabel,
      });
      const reminderSettings = ReminderSettings.create({
        enabled: activityData.reminderSettings.enabled,
        hoursBefore: activityData.reminderSettings.hoursBefore,
      });

      const activity = Activity.create({
        id: activityData.id,
        name: activityData.name,
        description: activityData.description,
        durationMinutes: activityData.durationMinutes,
        color: activityData.color,
        price: activityData.price,
        requiredFields,
        reminderSettings,
        minimumBookingNoticeHours: activityData.minimumBookingNoticeHours,
        createdAt: new Date(activityData.createdAt),
        updatedAt: new Date(activityData.updatedAt),
      });
      await this.activityRepository.save(activity);
    }

    return activities.length;
  }

  private async importAvailability(zip: AdmZip): Promise<boolean> {
    const entry = zip.getEntry('data/availability.json');
    if (!entry) return false;

    const availabilityData: SerializedAvailability = JSON.parse(
      entry.getData().toString('utf8')
    );

    const weeklySlots = availabilityData.weeklySlots.map((slot) =>
      WeeklySlot.create({
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
      })
    );

    const exceptions = availabilityData.exceptions.map((exc) =>
      AvailabilityException.create({
        date: new Date(exc.date),
        reason: exc.reason,
      })
    );

    const availability = Availability.create({
      id: availabilityData.id,
      weeklySlots,
      exceptions,
      updatedAt: new Date(availabilityData.updatedAt),
    });

    await this.availabilityRepository.save(availability);

    return true;
  }

  private async importImages(zip: AdmZip): Promise<number> {
    // Import page content images
    const pageContentImageEntries = zip.getEntries().filter((entry) => {
      return (
        entry.entryName.startsWith('images/page-content-images/') &&
        !entry.isDirectory
      );
    });

    if (pageContentImageEntries.length > 0) {
      // Ensure images directory exists
      await fs.mkdir(IMAGES_DIR, { recursive: true });

      for (const entry of pageContentImageEntries) {
        const filename = path.basename(entry.entryName);
        const targetPath = path.join(IMAGES_DIR, filename);
        await fs.writeFile(targetPath, entry.getData());
      }
    }

    // Import icon images (logo, favicon)
    const iconEntries = zip.getEntries().filter((entry) => {
      return entry.entryName.startsWith('images/icons/') && !entry.isDirectory;
    });

    if (iconEntries.length > 0) {
      // Ensure icons directory exists
      await fs.mkdir(ICONS_DIR, { recursive: true });

      for (const entry of iconEntries) {
        const filename = path.basename(entry.entryName);
        const targetPath = path.join(ICONS_DIR, filename);
        await fs.writeFile(targetPath, entry.getData());
      }
    }

    // Import loader files (custom loading animations)
    const loaderEntries = zip.getEntries().filter((entry) => {
      return (
        entry.entryName.startsWith('images/loaders/') && !entry.isDirectory
      );
    });

    if (loaderEntries.length > 0) {
      // Ensure loaders directory exists
      await fs.mkdir(LOADERS_DIR, { recursive: true });

      for (const entry of loaderEntries) {
        const filename = path.basename(entry.entryName);
        const targetPath = path.join(LOADERS_DIR, filename);
        await fs.writeFile(targetPath, entry.getData());
      }
    }

    // Import product images
    const productImageEntries = zip.getEntries().filter((entry) => {
      return (
        entry.entryName.startsWith('images/product-images/') &&
        !entry.isDirectory
      );
    });

    if (productImageEntries.length > 0) {
      // Ensure product images directory exists
      await fs.mkdir(PRODUCT_IMAGES_DIR, { recursive: true });

      for (const entry of productImageEntries) {
        const filename = path.basename(entry.entryName);
        const targetPath = path.join(PRODUCT_IMAGES_DIR, filename);
        await fs.writeFile(targetPath, entry.getData());
      }
    }

    return (
      pageContentImageEntries.length +
      iconEntries.length +
      loaderEntries.length +
      productImageEntries.length
    );
  }
}
