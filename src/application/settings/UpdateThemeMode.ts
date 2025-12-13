import { injectable, inject } from 'tsyringe';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import type { IUpdateThemeMode } from '@/application/settings/IUpdateThemeMode';
import { ThemeModePreference } from '@/domain/settings/value-objects/ThemeModePreference';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

/**
 * Use case for updating theme mode configuration
 */
@injectable()
export class UpdateThemeMode implements IUpdateThemeMode {
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly repository: WebsiteSettingsRepository
  ) {}

  async execute(themeMode: ThemeModePreference): Promise<void> {
    await this.repository.setByKey(
      VALID_SETTING_KEYS.THEME_MODE,
      themeMode.value
    );
  }
}
