import { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import {
  WebsiteSetting,
  SettingValue,
} from '@/domain/settings/entities/WebsiteSetting';
import { WebsiteSettingsModel } from '@/infrastructure/settings/models/WebsiteSettingsModel';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';
import { inject, injectable } from 'tsyringe';
import { Logger } from '@/application/shared/Logger';

@injectable()
export class MongooseWebsiteSettingsRepository
  implements WebsiteSettingsRepository
{
  constructor(@inject('Logger') private readonly logger: Logger) {}
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
    await WebsiteSettingsModel.updateOne(
      { key },
      { $set: { key, value } },
      { upsert: true }
    );
  }

  private mapDocumentToEntity(doc: {
    key: string;
    value: unknown;
  }): WebsiteSetting {
    return new WebsiteSetting(doc.key, doc.value as SettingValue);
  }

  private getDefaultValue(key: string): SettingValue {
    switch (key) {
      case VALID_SETTING_KEYS.WEBSITE_NAME:
        return WebsiteSetting.createDefaultWebsiteName().value;
      case VALID_SETTING_KEYS.WEBSITE_ICON:
        return WebsiteSetting.createDefaultWebsiteIcon().value;
      case VALID_SETTING_KEYS.THEME_COLOR:
        return WebsiteSetting.createDefaultThemeColor().value;
      case VALID_SETTING_KEYS.WEBSITE_FONT:
        return WebsiteSetting.createDefaultWebsiteFont().value;
      case VALID_SETTING_KEYS.BACKGROUND_COLOR:
        return WebsiteSetting.createDefaultBackgroundColor().value;
      case VALID_SETTING_KEYS.CUSTOM_LOADER:
        return WebsiteSetting.createDefaultCustomLoader().value;
      case VALID_SETTING_KEYS.SELLING_ENABLED:
        return WebsiteSetting.createDefaultSellingEnabled().value;
      default:
        // Log warning for unknown setting keys but return null as safe default
        this.logger.warn(
          `Unknown setting key requested: ${key}, returning null`
        );
        return null;
    }
  }
}
