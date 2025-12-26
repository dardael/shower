import { injectable, inject } from 'tsyringe';
import type { IGetHeaderMenuTextColor } from '@/application/settings/interfaces/IGetHeaderMenuTextColor';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { HeaderMenuTextColor } from '@/domain/settings/value-objects/HeaderMenuTextColor';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

@injectable()
export class GetHeaderMenuTextColor implements IGetHeaderMenuTextColor {
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly repository: WebsiteSettingsRepository
  ) {}

  async execute(): Promise<HeaderMenuTextColor> {
    const setting = await this.repository.getByKey(
      VALID_SETTING_KEYS.HEADER_MENU_TEXT_COLOR
    );
    const value = setting.value;

    if (typeof value === 'string' && HeaderMenuTextColor.isValid(value)) {
      return HeaderMenuTextColor.create(value);
    }

    return HeaderMenuTextColor.createDefault();
  }
}
