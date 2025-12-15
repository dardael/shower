import { injectable, inject } from 'tsyringe';
import type { IGetWebsiteIcon } from './IGetWebsiteIcon';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

@injectable()
export class GetWebsiteIcon implements IGetWebsiteIcon {
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly websiteSettingsRepository: WebsiteSettingsRepository
  ) {}

  async execute(): Promise<WebsiteIcon | null> {
    try {
      const setting = await this.websiteSettingsRepository.getByKey(
        VALID_SETTING_KEYS.WEBSITE_ICON
      );
      const iconValue = setting.getValueAsIcon();
      if (!iconValue) {
        return null;
      }

      // Ensure uploadedAt is a Date object (MongoDB may return it as a string)
      const metadata = {
        ...iconValue.metadata,
        uploadedAt:
          iconValue.metadata.uploadedAt instanceof Date
            ? iconValue.metadata.uploadedAt
            : new Date(iconValue.metadata.uploadedAt),
      };

      return new WebsiteIcon(iconValue.url, metadata);
    } catch {
      return null;
    }
  }
}
