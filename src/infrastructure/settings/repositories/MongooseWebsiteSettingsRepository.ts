import { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import {
  WebsiteSetting,
  SettingValue,
} from '@/domain/settings/entities/WebsiteSetting';
import { WebsiteSettingsModel } from '@/infrastructure/settings/models/WebsiteSettingsModel';

export class MongooseWebsiteSettingsRepository
  implements WebsiteSettingsRepository
{
  async getByKey(key: string): Promise<WebsiteSetting> {
    const settingDoc = await WebsiteSettingsModel.findOne({ key });

    if (!settingDoc) {
      // Create default value based on key
      const defaultValue = this.getDefaultValue(key);
      const createdDoc = await WebsiteSettingsModel.create({
        key,
        value: defaultValue,
      });
      return this.mapDocumentToEntity(createdDoc);
    }

    return this.mapDocumentToEntity(settingDoc);
  }

  async setByKey(key: string, value: SettingValue): Promise<void> {
    await WebsiteSettingsModel.updateOne({ key }, { value }, { upsert: true });
  }

  async exists(key: string): Promise<boolean> {
    const doc = await WebsiteSettingsModel.findOne({ key });
    return doc !== null;
  }

  private mapDocumentToEntity(doc: {
    key: string;
    value: unknown;
  }): WebsiteSetting {
    return new WebsiteSetting(doc.key, doc.value as SettingValue);
  }

  private getDefaultValue(key: string): SettingValue {
    switch (key) {
      case 'website-name':
        return WebsiteSetting.createDefaultWebsiteName().value;
      case 'website-icon':
        return WebsiteSetting.createDefaultWebsiteIcon().value;
      case 'theme-color':
        return WebsiteSetting.createDefaultThemeColor().value;
      default:
        return null;
    }
  }
}
