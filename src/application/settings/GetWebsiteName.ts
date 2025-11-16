import { inject, injectable } from 'tsyringe';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import type { IGetWebsiteName } from '@/application/settings/IGetWebsiteName';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

@injectable()
export class GetWebsiteName implements IGetWebsiteName {
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly repository: WebsiteSettingsRepository
  ) {}

  async execute(): Promise<string> {
    try {
      const setting = await this.repository.getByKey(
        VALID_SETTING_KEYS.WEBSITE_NAME
      );
      return setting.getValueAsString();
    } catch {
      // If no website name is set, return default
      return 'Shower';
    }
  }
}
