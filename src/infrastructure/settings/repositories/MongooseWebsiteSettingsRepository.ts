import { WebsiteSettingsRepository } from '../../../domain/settings/repositories/WebsiteSettingsRepository';
import { WebsiteSettings } from '../../../domain/settings/entities/WebsiteSettings';
import { WebsiteName } from '../../../domain/settings/value-objects/WebsiteName';
import { WebsiteIcon } from '../../../domain/settings/value-objects/WebsiteIcon';
import {
  WebsiteSettingsModel,
  type IIconMetadata,
} from '../models/WebsiteSettingsModel';

export class MongooseWebsiteSettingsRepository
  implements WebsiteSettingsRepository
{
  async getSettingsByKey(key: string): Promise<WebsiteSettings> {
    let settingsDoc = await WebsiteSettingsModel.findOne({ key });

    if (!settingsDoc) {
      // Create default settings if none exist for this key
      settingsDoc = await WebsiteSettingsModel.create({ key, name: 'Shower' });
    }

    const name = new WebsiteName(settingsDoc.name);
    const icon = settingsDoc.icon
      ? this.mapIconToDomain(settingsDoc.icon)
      : null;
    return new WebsiteSettings(key, name, icon);
  }

  async updateSettings(settings: WebsiteSettings): Promise<void> {
    const updateData: Record<string, unknown> = {
      name: settings.name.value,
    };

    if (settings.icon) {
      updateData.icon = this.mapIconToDatabase(settings.icon);
    } else {
      updateData.icon = null;
    }

    await WebsiteSettingsModel.updateOne(
      { key: settings.key },
      updateData,
      { upsert: true } // Create if doesn't exist
    );
  }

  async updateIcon(key: string, icon: WebsiteIcon | null): Promise<void> {
    const updateData = icon
      ? { icon: this.mapIconToDatabase(icon) }
      : { icon: null };

    await WebsiteSettingsModel.updateOne({ key }, updateData, { upsert: true });
  }

  async getIcon(key: string): Promise<WebsiteIcon | null> {
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
