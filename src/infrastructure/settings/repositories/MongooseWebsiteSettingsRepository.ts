import { WebsiteSettingsRepository } from '../../../domain/settings/repositories/WebsiteSettingsRepository';
import { WebsiteSettings } from '../../../domain/settings/entities/WebsiteSettings';
import { WebsiteName } from '../../../domain/settings/value-objects/WebsiteName';
import { WebsiteSettingsModel } from '../models/WebsiteSettingsModel';

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
    return new WebsiteSettings(key, name);
  }

  async updateSettings(settings: WebsiteSettings): Promise<void> {
    await WebsiteSettingsModel.updateOne(
      { key: settings.key },
      { name: settings.name.value },
      { upsert: true } // Create if doesn't exist
    );
  }
}
