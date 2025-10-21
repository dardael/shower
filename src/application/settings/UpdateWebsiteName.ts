import { inject, injectable } from 'tsyringe';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { WebsiteName } from '@/domain/settings/value-objects/WebsiteName';
import type { IUpdateWebsiteName } from '@/application/settings/IUpdateWebsiteName';

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
    const settings = await this.repository.getSettingsByKey('name');
    const newName = new WebsiteName(request.name);
    settings.updateName(newName);
    await this.repository.updateSettings(settings);
  }
}
