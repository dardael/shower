import { injectable, inject } from 'tsyringe';
import type { IGetHeaderLogo } from './IGetHeaderLogo';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { HeaderLogo } from '@/domain/settings/value-objects/HeaderLogo';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

@injectable()
export class GetHeaderLogo implements IGetHeaderLogo {
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly websiteSettingsRepository: WebsiteSettingsRepository
  ) {}

  async execute(): Promise<HeaderLogo | null> {
    try {
      const setting = await this.websiteSettingsRepository.getByKey(
        VALID_SETTING_KEYS.HEADER_LOGO
      );
      const logoValue = setting.getValueAsImage();

      if (!logoValue) {
        return null;
      }

      // Ensure uploadedAt is a Date object (MongoDB may return it as a string)
      const metadata = {
        ...logoValue.metadata,
        uploadedAt:
          logoValue.metadata.uploadedAt instanceof Date
            ? logoValue.metadata.uploadedAt
            : new Date(logoValue.metadata.uploadedAt),
      };

      return new HeaderLogo(logoValue.url, metadata);
    } catch {
      return null;
    }
  }
}
