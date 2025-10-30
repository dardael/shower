import { injectable, inject } from 'tsyringe';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import type { IGetThemeColor } from '@/application/settings/IGetThemeColor';
import { ThemeColor } from '@/domain/settings/value-objects/ThemeColor';

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
      const settings = await this.repository.getSettingsByKey('website');
      return settings.themeColor;
    } catch {
      // If no theme color is set, return default
      return ThemeColor.createDefault();
    }
  }
}
