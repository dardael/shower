import { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { WebsiteSettings } from '@/domain/settings/entities/WebsiteSettings';
import { WebsiteName } from '@/domain/settings/value-objects/WebsiteName';
import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';
import { ThemeColor } from '@/domain/settings/value-objects/ThemeColor';
import {
  WebsiteSettingsModel,
  type IIconMetadata,
} from '@/infrastructure/settings/models/WebsiteSettingsModel';

export class MongooseWebsiteSettingsRepository
  implements WebsiteSettingsRepository
{
  async getSettingsByKey(key: string): Promise<WebsiteSettings> {
    if (!key) {
      key = 'website';
    }

    let settingsDoc = await WebsiteSettingsModel.findOne({ key });

    if (!settingsDoc) {
      // Create default settings if none exist for this key
      settingsDoc = await WebsiteSettingsModel.create({
        key,
        name: 'Shower',
        themeColor: 'blue',
      });
    }

    const name = new WebsiteName(settingsDoc.name || 'Shower');
    const icon = settingsDoc.icon
      ? this.mapIconToDomain(settingsDoc.icon)
      : null;
    const themeColor = ThemeColor.fromString(settingsDoc.themeColor || null);
    // Initialize with empty social networks array since this method fetches general settings only
    // Social networks are managed separately through their own repository
    return new WebsiteSettings(key, name, icon, [], themeColor);
  }

  async updateSettings(settings: WebsiteSettings): Promise<void> {
    const updateData: Record<string, unknown> = {
      name: settings.name?.value || 'Shower',
      themeColor: settings.themeColor?.value || 'blue',
    };

    if (settings.icon) {
      updateData.icon = this.mapIconToDatabase(settings.icon);
    } else {
      updateData.icon = null;
    }

    await WebsiteSettingsModel.updateOne(
      { key: settings.key || 'website' },
      updateData,
      { upsert: true } // Create if doesn't exist
    );
  }

  async updateIcon(key: string, icon: WebsiteIcon | null): Promise<void> {
    const updateData = icon
      ? { icon: this.mapIconToDatabase(icon) }
      : { icon: null };

    await WebsiteSettingsModel.updateOne(
      { key: key || 'website' },
      updateData,
      { upsert: true }
    );
  }

  async getIcon(key: string): Promise<WebsiteIcon | null> {
    if (!key) {
      return null;
    }

    const settingsDoc = await WebsiteSettingsModel.findOne({ key });

    if (!settingsDoc || !settingsDoc.icon) {
      return null;
    }

    return this.mapIconToDomain(settingsDoc.icon);
  }

  private mapIconToDomain(iconDoc: {
    url: string;
    metadata: IIconMetadata;
  }): WebsiteIcon {
    return new WebsiteIcon(iconDoc.url, {
      filename: iconDoc.metadata.filename,
      originalName: iconDoc.metadata.originalName,
      size: iconDoc.metadata.size,
      format: iconDoc.metadata.format,
      mimeType: iconDoc.metadata.mimeType,
      uploadedAt: iconDoc.metadata.uploadedAt,
    });
  }

  private mapIconToDatabase(icon: WebsiteIcon): {
    url: string;
    metadata: IIconMetadata;
  } {
    return {
      url: icon.url,
      metadata: {
        filename: icon.filename,
        originalName: icon.originalName,
        size: icon.size,
        format: icon.format,
        mimeType: icon.mimeType,
        uploadedAt: icon.uploadedAt,
      },
    };
  }
}
