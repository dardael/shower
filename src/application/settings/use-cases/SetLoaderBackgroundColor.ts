import { injectable, inject } from 'tsyringe';
import type { ISetLoaderBackgroundColor } from '@/application/settings/interfaces/ISetLoaderBackgroundColor';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import type { LoaderBackgroundColor } from '@/domain/settings/value-objects/LoaderBackgroundColor';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

@injectable()
export class SetLoaderBackgroundColor implements ISetLoaderBackgroundColor {
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly repository: WebsiteSettingsRepository
  ) {}

  async execute(color: LoaderBackgroundColor | null): Promise<void> {
    await this.repository.setByKey(
      VALID_SETTING_KEYS.LOADER_BACKGROUND_COLOR,
      color?.toString() ?? null
    );
  }
}
