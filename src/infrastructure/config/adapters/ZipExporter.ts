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
import { VALID_SETTING_KEY_VALUES } from '@/domain/settings/constants/SettingKeys';
import type { ILogger } from '@/application/shared/ILogger';
import type {
  SerializedMenuItem,
  SerializedPageContent,
  SerializedSetting,
  SerializedSocialNetwork,
} from '@/infrastructure/config/types/SerializedTypes';

const PAGE_CONTENT_IMAGES_PATH = path.join(
  process.cwd(),
  'public',
  'page-content-images'
);

const ICONS_PATH = path.join(process.cwd(), 'public', 'icons');

const LOADERS_PATH = path.join(process.cwd(), 'public', 'loaders');

interface CollectedData {
  menuItems: SerializedMenuItem[];
  pageContents: SerializedPageContent[];
  settings: SerializedSetting[];
  socialNetworks: SerializedSocialNetwork[];
  imageFiles: string[];
  iconFiles: string[];
  loaderFiles: string[];
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
      imageCount:
        data.imageFiles.length +
        data.iconFiles.length +
        data.loaderFiles.length,
      totalSizeBytes: 0,
    };

    const exportPackage = ExportPackage.create({ summary });
    const manifest = exportPackage.toManifest();

    const buffer = await this.createZipBuffer(manifest, data);

    this.logger.logInfo(
      `Export complete: ${data.menuItems.length} menu items, ${data.pageContents.length} pages, ${data.settings.length} settings, ${data.socialNetworks.length} social networks, ${data.imageFiles.length + data.iconFiles.length} images`
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
      imageCount:
        data.imageFiles.length +
        data.iconFiles.length +
        data.loaderFiles.length,
      totalSizeBytes: await this.calculateTotalSize(
        data.imageFiles,
        data.iconFiles,
        data.loaderFiles
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
      imageFiles,
      iconFiles,
      loaderFiles,
    ] = await Promise.all([
      this.collectMenuItems(),
      this.collectPageContents(),
      this.collectSettings(),
      this.collectSocialNetworks(),
      this.collectImageFiles(),
      this.collectIconFiles(),
      this.collectLoaderFiles(),
    ]);

    return {
      menuItems,
      pageContents,
      settings,
      socialNetworks,
      imageFiles,
      iconFiles,
      loaderFiles,
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

  private async calculateTotalSize(
    imageFiles: string[],
    iconFiles: string[],
    loaderFiles: string[]
  ): Promise<number> {
    let totalSize = 0;

    for (const file of imageFiles) {
      const filePath = path.join(PAGE_CONTENT_IMAGES_PATH, file);
      const stats = await fs.stat(filePath);
      totalSize += stats.size;
    }

    for (const file of iconFiles) {
      const filePath = path.join(ICONS_PATH, file);
      const stats = await fs.stat(filePath);
      totalSize += stats.size;
    }

    for (const file of loaderFiles) {
      const filePath = path.join(LOADERS_PATH, file);
      const stats = await fs.stat(filePath);
      totalSize += stats.size;
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

      archive.finalize();
    });
  }
}
