import 'reflect-metadata';
import { injectable } from 'tsyringe';
import type { IUpdateWebsiteIcon } from './IUpdateWebsiteIcon';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

@injectable()
export class UpdateWebsiteIcon implements IUpdateWebsiteIcon {
  constructor(
    private readonly websiteSettingsRepository: WebsiteSettingsRepository
  ) {}

  async execute(icon: WebsiteIcon | null): Promise<void> {
    const iconValue = icon
      ? {
          url: icon.url,
          metadata: {
            filename: icon.filename,
            originalName: icon.originalName,
            size: icon.size,
            format: icon.format,
            mimeType: icon.mimeType,
            uploadedAt: icon.uploadedAt,
          },
        }
      : null;

    await this.websiteSettingsRepository.setByKey(
      VALID_SETTING_KEYS.WEBSITE_ICON,
      iconValue
    );
  }
}
