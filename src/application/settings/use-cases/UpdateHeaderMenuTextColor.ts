import { injectable, inject } from 'tsyringe';
import type { IUpdateHeaderMenuTextColor } from '@/application/settings/interfaces/IUpdateHeaderMenuTextColor';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import type { HeaderMenuTextColor } from '@/domain/settings/value-objects/HeaderMenuTextColor';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

@injectable()
export class UpdateHeaderMenuTextColor implements IUpdateHeaderMenuTextColor {
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly repository: WebsiteSettingsRepository
  ) {}

  async execute(color: HeaderMenuTextColor): Promise<void> {
    await this.repository.setByKey(
      VALID_SETTING_KEYS.HEADER_MENU_TEXT_COLOR,
      color.toString()
    );
  }
}
