import { injectable, inject } from 'tsyringe';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import type { IGetBackgroundColor } from '@/application/settings/IGetBackgroundColor';
import { BackgroundColor } from '@/domain/settings/value-objects/BackgroundColor';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

/**
 * Use case for retrieving website background color
 */
@injectable()
export class GetBackgroundColor implements IGetBackgroundColor {
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly repository: WebsiteSettingsRepository
  ) {}

  async execute(): Promise<BackgroundColor> {
    try {
      const setting = await this.repository.getByKey(
        VALID_SETTING_KEYS.BACKGROUND_COLOR
      );
      const colorValue = setting.getValueAsString();
      return BackgroundColor.fromString(colorValue);
    } catch {
      // If no background color is set, return default
      return BackgroundColor.createDefault();
    }
  }
}
