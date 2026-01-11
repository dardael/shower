import archiver from 'archiver';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Writable } from 'stream';
import type { IConfigurationExporter } from '@/domain/config/ports/IConfigurationExporter';
import { ExportPackage } from '@/domain/config/entities/ExportPackage';
import type { PackageSummary } from '@/domain/config/entities/PackageSummary';
import type { MenuItemRepository } from '@/domain/menu/repositories/MenuItemRepository';
import type { IPageContentRepository } from '@/domain/pages/repositories/IPageContentRepository';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import type { SocialNetworkRepository } from '@/domain/settings/repositories/SocialNetworkRepository';
import type { IProductRepository } from '@/domain/product/repositories/IProductRepository';
import type { ICategoryRepository } from '@/domain/product/repositories/ICategoryRepository';
import type { IActivityRepository } from '@/domain/appointment/repositories/IActivityRepository';
import type { IAvailabilityRepository } from '@/domain/appointment/repositories/IAvailabilityRepository';
import { VALID_SETTING_KEY_VALUES } from '@/domain/settings/constants/SettingKeys';
import type { ILogger } from '@/application/shared/ILogger';
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

const PAGE_CONTENT_IMAGES_PATH = path.join(
  process.cwd(),
  'public',
  'page-content-images'
);

const ICONS_PATH = path.join(process.cwd(), 'public', 'icons');

const LOADERS_PATH = path.join(process.cwd(), 'public', 'loaders');

const PRODUCT_IMAGES_PATH = path.join(
  process.cwd(),
  'public',
  'product-images'
);

interface CollectedData {
  menuItems: SerializedMenuItem[];
  pageContents: SerializedPageContent[];
  settings: SerializedSetting[];
  socialNetworks: SerializedSocialNetwork[];
  products: SerializedProduct[];
  categories: SerializedCategory[];
  activities: SerializedActivity[];
  availability: SerializedAvailability | null;
  imageFiles: string[];
  iconFiles: string[];
  loaderFiles: string[];
  productImageFiles: string[];
}

/**
 * ZipExporter adapter implementing IConfigurationExporter.
 * Creates ZIP packages containing all configuration data and images.
 */
export class ZipExporter implements IConfigurationExporter {
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

  async exportToZip(): Promise<Buffer> {
    this.logger.logInfo('Starting configuration export');

    const data = await this.collectAllData();

    const summary: PackageSummary = {
      menuItemCount: data.menuItems.length,
      pageContentCount: data.pageContents.length,
      settingsCount: data.settings.length,
      socialNetworkCount: data.socialNetworks.length,
      productCount: data.products.length,
      categoryCount: data.categories.length,
      activityCount: data.activities.length,
      hasAvailability: data.availability !== null,
      imageCount:
        data.imageFiles.length +
        data.iconFiles.length +
        data.loaderFiles.length +
        data.productImageFiles.length,
      totalSizeBytes: 0,
    };

    const exportPackage = ExportPackage.create({ summary });
    const manifest = exportPackage.toManifest();

    const buffer = await this.createZipBuffer(manifest, data);

    this.logger.logInfo(
      `Export complete: ${data.menuItems.length} menu items, ${data.pageContents.length} pages, ${data.settings.length} settings, ${data.socialNetworks.length} social networks, ${data.products.length} products, ${data.categories.length} categories, ${data.activities.length} activities, ${data.imageFiles.length + data.iconFiles.length + data.productImageFiles.length} images`
    );

    return buffer;
  }

  async getExportSummary(): Promise<ExportPackage> {
    const data = await this.collectAllData();

    const summary: PackageSummary = {
      menuItemCount: data.menuItems.length,
      pageContentCount: data.pageContents.length,
      settingsCount: data.settings.length,
      socialNetworkCount: data.socialNetworks.length,
      productCount: data.products.length,
      categoryCount: data.categories.length,
      activityCount: data.activities.length,
      hasAvailability: data.availability !== null,
      imageCount:
        data.imageFiles.length +
        data.iconFiles.length +
        data.loaderFiles.length +
        data.productImageFiles.length,
      totalSizeBytes: await this.calculateTotalSize(
        data.imageFiles,
        data.iconFiles,
        data.loaderFiles,
        data.productImageFiles
      ),
    };

    return ExportPackage.create({ summary });
  }

  private async collectAllData(): Promise<CollectedData> {
    const [
      menuItems,
      pageContents,
      settings,
      socialNetworks,
      products,
      categories,
      activities,
      availability,
      imageFiles,
      iconFiles,
      loaderFiles,
      productImageFiles,
    ] = await Promise.all([
      this.collectMenuItems(),
      this.collectPageContents(),
      this.collectSettings(),
      this.collectSocialNetworks(),
      this.collectProducts(),
      this.collectCategories(),
      this.collectActivities(),
      this.collectAvailability(),
      this.collectImageFiles(),
      this.collectIconFiles(),
      this.collectLoaderFiles(),
      this.collectProductImageFiles(),
    ]);

    return {
      menuItems,
      pageContents,
      settings,
      socialNetworks,
      products,
      categories,
      activities,
      availability,
      imageFiles,
      iconFiles,
      loaderFiles,
      productImageFiles,
    };
  }

  private async collectMenuItems(): Promise<SerializedMenuItem[]> {
    const menuItems = await this.menuItemRepository.findAll();
    return menuItems.map((item) => ({
      id: item.id,
      text: item.text.value,
      url: item.url?.value ?? null,
      position: item.position,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
  }

  private async collectPageContents(): Promise<SerializedPageContent[]> {
    const menuItems = await this.menuItemRepository.findAll();
    const pageContents: SerializedPageContent[] = [];

    for (const menuItem of menuItems) {
      const pageContent = await this.pageContentRepository.findByMenuItemId(
        menuItem.id
      );
      if (pageContent) {
        pageContents.push({
          id: pageContent.id,
          menuItemId: pageContent.menuItemId,
          content: pageContent.content.value,
          createdAt: pageContent.createdAt.toISOString(),
          updatedAt: pageContent.updatedAt.toISOString(),
        });
      }
    }

    return pageContents;
  }

  private async collectSettings(): Promise<SerializedSetting[]> {
    const settings: SerializedSetting[] = [];

    for (const key of VALID_SETTING_KEY_VALUES) {
      try {
        const setting = await this.websiteSettingsRepository.getByKey(key);
        if (setting) {
          settings.push({
            key: setting.key,
            value: setting.value,
          });
        }
      } catch (error) {
        this.logger.logDebug(`Setting '${key}' not found, skipping: ${error}`);
      }
    }

    return settings;
  }

  private async collectSocialNetworks(): Promise<SerializedSocialNetwork[]> {
    const socialNetworks =
      await this.socialNetworkRepository.getAllSocialNetworks();
    return socialNetworks.map((sn) => sn.toJSON());
  }

  private async collectProducts(): Promise<SerializedProduct[]> {
    const products = await this.productRepository.getAll();
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      displayOrder: product.displayOrder,
      categoryIds: product.categoryIds,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));
  }

  private async collectCategories(): Promise<SerializedCategory[]> {
    const categories = await this.categoryRepository.getAll();
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      displayOrder: category.displayOrder,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }));
  }

  private async collectActivities(): Promise<SerializedActivity[]> {
    const activities = await this.activityRepository.findAll();
    return activities.map((activity) => ({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      durationMinutes: activity.durationMinutes,
      color: activity.color,
      price: activity.price,
      requiredFields: activity.requiredFields.toObject(),
      reminderSettings: activity.reminderSettings.toObject(),
      minimumBookingNoticeHours: activity.minimumBookingNoticeHours,
      createdAt: activity.createdAt.toISOString(),
      updatedAt: activity.updatedAt.toISOString(),
    }));
  }

  private async collectAvailability(): Promise<SerializedAvailability | null> {
    const availability = await this.availabilityRepository.find();
    if (!availability) {
      return null;
    }

    return {
      id: availability.id,
      weeklySlots: availability.weeklySlots.map((slot) => slot.toObject()),
      exceptions: availability.exceptions.map((exception) => ({
        date: exception.date.toISOString(),
        reason: exception.reason,
      })),
      updatedAt: availability.updatedAt.toISOString(),
    };
  }

  private async collectImageFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(PAGE_CONTENT_IMAGES_PATH);
      return files.filter((f: string) =>
        /\.(jpg|jpeg|png|gif|webp|ico|svg)$/i.test(f)
      );
    } catch {
      // Directory doesn't exist
      return [];
    }
  }

  private async collectIconFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(ICONS_PATH);
      return files.filter((f: string) =>
        /\.(jpg|jpeg|png|gif|webp|ico|svg)$/i.test(f)
      );
    } catch {
      // Directory doesn't exist
      return [];
    }
  }

  private async collectLoaderFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(LOADERS_PATH);
      return files.filter((f: string) => /\.(gif|mp4|webm)$/i.test(f));
    } catch {
      // Directory doesn't exist
      return [];
    }
  }

  private async collectProductImageFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(PRODUCT_IMAGES_PATH);
      return files.filter((f: string) =>
        /\.(jpg|jpeg|png|gif|webp|ico|svg)$/i.test(f)
      );
    } catch {
      // Directory doesn't exist
      return [];
    }
  }

  private async calculateTotalSize(
    imageFiles: string[],
    iconFiles: string[],
    loaderFiles: string[],
    productImageFiles: string[]
  ): Promise<number> {
    let totalSize = 0;

    for (const file of imageFiles) {
      const filePath = path.join(PAGE_CONTENT_IMAGES_PATH, file);
      try {
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
      } catch {
        // File doesn't exist
      }
    }

    for (const file of iconFiles) {
      const filePath = path.join(ICONS_PATH, file);
      try {
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
      } catch {
        // File doesn't exist
      }
    }

    for (const file of loaderFiles) {
      const filePath = path.join(LOADERS_PATH, file);
      try {
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
      } catch {
        // File doesn't exist
      }
    }

    for (const file of productImageFiles) {
      const filePath = path.join(PRODUCT_IMAGES_PATH, file);
      try {
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
      } catch {
        // File doesn't exist
      }
    }

    return totalSize;
  }

  private async createZipBuffer(
    manifest: object,
    data: CollectedData
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      const writableStream = new Writable({
        write(chunk, _encoding, callback) {
          chunks.push(chunk);
          callback();
        },
      });

      const archive = archiver('zip', { zlib: { level: 9 } });

      archive.on('error', (err) => reject(err));
      archive.on('end', () => resolve(Buffer.concat(chunks)));

      archive.pipe(writableStream);

      // Add manifest
      archive.append(JSON.stringify(manifest, null, 2), {
        name: 'manifest.json',
      });

      // Add data files
      archive.append(JSON.stringify(data.menuItems, null, 2), {
        name: 'data/menu-items.json',
      });
      archive.append(JSON.stringify(data.pageContents, null, 2), {
        name: 'data/page-contents.json',
      });
      archive.append(JSON.stringify(data.settings, null, 2), {
        name: 'data/settings.json',
      });
      archive.append(JSON.stringify(data.socialNetworks, null, 2), {
        name: 'data/social-networks.json',
      });
      archive.append(JSON.stringify(data.products, null, 2), {
        name: 'data/products.json',
      });
      archive.append(JSON.stringify(data.categories, null, 2), {
        name: 'data/categories.json',
      });
      archive.append(JSON.stringify(data.activities, null, 2), {
        name: 'data/activities.json',
      });
      if (data.availability) {
        archive.append(JSON.stringify(data.availability, null, 2), {
          name: 'data/availability.json',
        });
      }

      // Add page content image files
      for (const imageFile of data.imageFiles) {
        const imagePath = path.join(PAGE_CONTENT_IMAGES_PATH, imageFile);
        archive.file(imagePath, {
          name: `images/page-content-images/${imageFile}`,
        });
      }

      // Add icon files (logo, favicon)
      for (const iconFile of data.iconFiles) {
        const iconPath = path.join(ICONS_PATH, iconFile);
        archive.file(iconPath, {
          name: `images/icons/${iconFile}`,
        });
      }

      // Add loader files (custom loading animations)
      for (const loaderFile of data.loaderFiles) {
        const loaderPath = path.join(LOADERS_PATH, loaderFile);
        archive.file(loaderPath, {
          name: `images/loaders/${loaderFile}`,
        });
      }

      // Add product image files
      for (const productImageFile of data.productImageFiles) {
        const productImagePath = path.join(
          PRODUCT_IMAGES_PATH,
          productImageFile
        );
        archive.file(productImagePath, {
          name: `images/product-images/${productImageFile}`,
        });
      }

      archive.finalize();
    });
  }
}
