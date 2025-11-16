import { injectable, inject } from 'tsyringe';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import type { IUpdateThemeColor } from '@/application/settings/IUpdateThemeColor';
import { ThemeColor } from '@/domain/settings/value-objects/ThemeColor';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

/**
 * Use case for updating website theme color
 */
@injectable()
export class UpdateThemeColor implements IUpdateThemeColor {
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly repository: WebsiteSettingsRepository
  ) {}

  async execute(themeColor: ThemeColor): Promise<void> {
    await this.repository.setByKey(
      VALID_SETTING_KEYS.THEME_COLOR,
      themeColor.value
    );
  }
}
