import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import type { IUpdateHeaderLogo } from './IUpdateHeaderLogo';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import type { HeaderLogo } from '@/domain/settings/value-objects/HeaderLogo';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

@injectable()
export class UpdateHeaderLogo implements IUpdateHeaderLogo {
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly websiteSettingsRepository: WebsiteSettingsRepository
  ) {}

  async execute(logo: HeaderLogo | null): Promise<void> {
    const logoValue = logo
      ? {
          url: logo.url,
          metadata: {
            filename: logo.filename,
            originalName: logo.originalName,
            size: logo.size,
            format: logo.format,
            mimeType: logo.mimeType,
            uploadedAt: logo.uploadedAt,
          },
        }
      : null;

    await this.websiteSettingsRepository.setByKey(
      VALID_SETTING_KEYS.HEADER_LOGO,
      logoValue
    );
  }
}
