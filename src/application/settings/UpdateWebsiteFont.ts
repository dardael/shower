import { injectable, inject } from 'tsyringe';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import type { IUpdateWebsiteFont } from '@/application/settings/IUpdateWebsiteFont';
import { WebsiteFont } from '@/domain/settings/value-objects/WebsiteFont';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

/**
 * Use case for updating website font
 */
@injectable()
export class UpdateWebsiteFont implements IUpdateWebsiteFont {
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly repository: WebsiteSettingsRepository
  ) {}

  async execute(websiteFont: WebsiteFont): Promise<void> {
    await this.repository.setByKey(
      VALID_SETTING_KEYS.WEBSITE_FONT,
      websiteFont.value
    );
  }
}
