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
import { MenuItem } from '@/domain/menu/entities/MenuItem';
import { MenuItemText } from '@/domain/menu/value-objects/MenuItemText';
import { MenuItemUrl } from '@/domain/menu/value-objects/MenuItemUrl';
import { PageContent } from '@/domain/pages/entities/PageContent';
import { PageContentBody } from '@/domain/pages/value-objects/PageContentBody';
import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
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
} from '@/infrastructure/config/types/SerializedTypes';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'page-content-images');
const ICONS_DIR = path.join(process.cwd(), 'public', 'icons');
const LOADERS_DIR = path.join(process.cwd(), 'public', 'loaders');

export class ZipImporter implements IConfigurationImporter {
  constructor(
    private readonly menuItemRepository: MenuItemRepository,
    private readonly pageContentRepository: IPageContentRepository,
    private readonly websiteSettingsRepository: WebsiteSettingsRepository,
    private readonly socialNetworkRepository: SocialNetworkRepository,
    private readonly logger: ILogger
  ) {}

  async validatePackage(zipBuffer: Buffer): Promise<ImportValidationResult> {
    try {
      const zip = new AdmZip(zipBuffer);
      const manifestEntry = zip.getEntry('manifest.json');

      if (!manifestEntry) {
        return {
          valid: false,
          error: 'Invalid package: missing manifest.json',
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
          error: `Incompatible package version: ${packageVersion.toString()}. Current version: ${currentVersion.toString()}`,
        };
      }

      const exportPackage = ExportPackage.fromManifest(manifestData);

      return {
        valid: true,
        package: exportPackage,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Invalid package format';
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
          error: validation.error ?? 'Invalid package',
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

      // Import images
      const imagesCount = await this.importImages(zip);

      this.logger.logInfo(
        `Import complete: ${menuItemsCount} menu items, ${pageContentsCount} pages, ${settingsCount} settings, ${socialNetworksCount} social networks, ${imagesCount} images`
      );

      return {
        success: true,
        message: 'Configuration imported successfully',
        imported: {
          menuItems: menuItemsCount,
          pageContents: pageContentsCount,
          settings: settingsCount,
          socialNetworks: socialNetworksCount,
          images: imagesCount,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error during import';
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

    return (
      pageContentImageEntries.length + iconEntries.length + loaderEntries.length
    );
  }
}
