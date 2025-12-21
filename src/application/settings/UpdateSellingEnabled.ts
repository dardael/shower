import { injectable, inject } from 'tsyringe';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import type { IUpdateSellingEnabled } from '@/application/settings/IUpdateSellingEnabled';
import { SellingEnabled } from '@/domain/settings/value-objects/SellingEnabled';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

/**
 * Use case for updating selling enabled configuration
 */
@injectable()
export class UpdateSellingEnabled implements IUpdateSellingEnabled {
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly repository: WebsiteSettingsRepository
  ) {}

  async execute(sellingEnabled: SellingEnabled): Promise<void> {
    await this.repository.setByKey(
      VALID_SETTING_KEYS.SELLING_ENABLED,
      sellingEnabled.value ? 'true' : 'false'
    );
  }
}
