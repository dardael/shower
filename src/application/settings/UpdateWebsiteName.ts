import { inject, injectable } from 'tsyringe';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { WebsiteName } from '@/domain/settings/value-objects/WebsiteName';
import type { IUpdateWebsiteName } from '@/application/settings/IUpdateWebsiteName';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

export interface UpdateWebsiteNameRequest {
  name: string;
}

@injectable()
export class UpdateWebsiteName implements IUpdateWebsiteName {
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly repository: WebsiteSettingsRepository
  ) {}

  async execute(request: UpdateWebsiteNameRequest): Promise<void> {
    const newName = new WebsiteName(request.name);
    await this.repository.setByKey(
      VALID_SETTING_KEYS.WEBSITE_NAME,
      newName.value
    );
  }
}
