import { inject, injectable } from 'tsyringe';
import type { WebsiteSettingsRepository } from '../../domain/settings/repositories/WebsiteSettingsRepository';
import type { IGetWebsiteName } from './IGetWebsiteName';

@injectable()
export class GetWebsiteName implements IGetWebsiteName {
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly repository: WebsiteSettingsRepository
  ) {}

  async execute(): Promise<string> {
    const settings = await this.repository.getSettingsByKey('name');
    return settings.name.value;
  }
}
