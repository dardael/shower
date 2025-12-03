import { injectable, inject } from 'tsyringe';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import type { IUpdateBackgroundColor } from '@/application/settings/IUpdateBackgroundColor';
import { BackgroundColor } from '@/domain/settings/value-objects/BackgroundColor';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

/**
 * Use case for updating website background color
 */
@injectable()
export class UpdateBackgroundColor implements IUpdateBackgroundColor {
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly repository: WebsiteSettingsRepository
  ) {}

  async execute(backgroundColor: BackgroundColor): Promise<void> {
    await this.repository.setByKey(
      VALID_SETTING_KEYS.BACKGROUND_COLOR,
      backgroundColor.value
    );
  }
}
