import { injectable, inject } from 'tsyringe';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import type { IGetSellingEnabled } from '@/application/settings/IGetSellingEnabled';
import { SellingEnabled } from '@/domain/settings/value-objects/SellingEnabled';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

/**
 * Use case for retrieving selling enabled configuration
 */
@injectable()
export class GetSellingEnabled implements IGetSellingEnabled {
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly repository: WebsiteSettingsRepository
  ) {}

  async execute(): Promise<SellingEnabled> {
    const setting = await this.repository.getByKey(
      VALID_SETTING_KEYS.SELLING_ENABLED
    );
    const value = setting?.value as string;

    if (value === 'true') {
      return SellingEnabled.enabled();
    }

    return SellingEnabled.disabled();
  }
}
