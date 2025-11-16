import { injectable, inject } from 'tsyringe';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import type { IGetThemeColor } from '@/application/settings/IGetThemeColor';
import { ThemeColor } from '@/domain/settings/value-objects/ThemeColor';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

/**
 * Use case for retrieving website theme color
 */
@injectable()
export class GetThemeColor implements IGetThemeColor {
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly repository: WebsiteSettingsRepository
  ) {}

  async execute(): Promise<ThemeColor> {
    try {
      const setting = await this.repository.getByKey(
        VALID_SETTING_KEYS.THEME_COLOR
      );
      const colorValue = setting.getValueAsString();
      return ThemeColor.fromString(colorValue);
    } catch {
      // If no theme color is set, return default
      return ThemeColor.createDefault();
    }
  }
}
