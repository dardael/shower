import { injectable, inject } from 'tsyringe';
import type { IGetLoaderBackgroundColor } from '@/application/settings/interfaces/IGetLoaderBackgroundColor';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { LoaderBackgroundColor } from '@/domain/settings/value-objects/LoaderBackgroundColor';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

@injectable()
export class GetLoaderBackgroundColor implements IGetLoaderBackgroundColor {
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly repository: WebsiteSettingsRepository
  ) {}

  async execute(): Promise<LoaderBackgroundColor> {
    const setting = await this.repository.getByKey(
      VALID_SETTING_KEYS.LOADER_BACKGROUND_COLOR
    );
    const value = setting.value;

    if (typeof value === 'string' && LoaderBackgroundColor.isValid(value)) {
      return LoaderBackgroundColor.create(value);
    }

    return LoaderBackgroundColor.createDefault();
  }
}
