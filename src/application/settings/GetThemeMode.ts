import { injectable, inject } from 'tsyringe';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import type { IGetThemeMode } from '@/application/settings/IGetThemeMode';
import { ThemeModePreference } from '@/domain/settings/value-objects/ThemeModePreference';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

/**
 * Use case for retrieving theme mode configuration
 */
@injectable()
export class GetThemeMode implements IGetThemeMode {
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly repository: WebsiteSettingsRepository
  ) {}

  async execute(): Promise<ThemeModePreference> {
    const setting = await this.repository.getByKey(
      VALID_SETTING_KEYS.THEME_MODE
    );
    const modeValue = setting?.value as string;

    if (modeValue && ThemeModePreference.isValid(modeValue)) {
      return ThemeModePreference.create(modeValue);
    }

    return ThemeModePreference.default();
  }
}
