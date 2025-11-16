import { injectable } from 'tsyringe';
import type { IGetWebsiteIcon } from './IGetWebsiteIcon';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

@injectable()
export class GetWebsiteIcon implements IGetWebsiteIcon {
  constructor(
    private readonly websiteSettingsRepository: WebsiteSettingsRepository
  ) {}

  async execute(): Promise<WebsiteIcon | null> {
    try {
      const setting = await this.websiteSettingsRepository.getByKey(
        VALID_SETTING_KEYS.WEBSITE_ICON
      );
      const iconValue = setting.getValueAsIcon();

      if (!iconValue) {
        return null; // No icon as default
      }

      return new WebsiteIcon(iconValue.url, iconValue.metadata);
    } catch {
      // If no website icon is set, return null as default
      return null;
    }
  }
}
