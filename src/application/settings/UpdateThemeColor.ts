import { injectable, inject } from 'tsyringe';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import type { IUpdateThemeColor } from '@/application/settings/IUpdateThemeColor';
import { ThemeColor } from '@/domain/settings/value-objects/ThemeColor';
import { WebsiteSettings } from '@/domain/settings/entities/WebsiteSettings';
import { WebsiteName } from '@/domain/settings/value-objects/WebsiteName';

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
    try {
      const settings = await this.repository.getSettingsByKey('website');
      settings.updateThemeColor(themeColor);
      await this.repository.updateSettings(settings);
    } catch {
      // If settings don't exist, create new ones with default values
      const defaultSettings = WebsiteSettings.createWithThemeColor(
        'website',
        new WebsiteName('Shower'),
        themeColor
      );

      await this.repository.updateSettings(defaultSettings);
    }
  }
}
