import { injectable, inject } from 'tsyringe';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import type { IUpdateThemeColor } from '@/application/settings/IUpdateThemeColor';
import { ThemeColor } from '@/domain/settings/value-objects/ThemeColor';

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
    await this.repository.setByKey('theme-color', themeColor.value);
  }
}
