import { injectable, inject } from 'tsyringe';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import type { IGetWebsiteFont } from '@/application/settings/IGetWebsiteFont';
import { WebsiteFont } from '@/domain/settings/value-objects/WebsiteFont';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

/**
 * Use case for retrieving website font
 */
@injectable()
export class GetWebsiteFont implements IGetWebsiteFont {
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly repository: WebsiteSettingsRepository
  ) {}

  async execute(): Promise<WebsiteFont> {
    try {
      const setting = await this.repository.getByKey(
        VALID_SETTING_KEYS.WEBSITE_FONT
      );
      const fontValue = setting.getValueAsString();
      return WebsiteFont.fromString(fontValue);
    } catch {
      // If no font is set, return default
      return WebsiteFont.createDefault();
    }
  }
}
