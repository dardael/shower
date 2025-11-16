import 'reflect-metadata';
import { injectable } from 'tsyringe';
import type { IGetWebsiteIcon } from './IGetWebsiteIcon';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';

@injectable()
export class GetWebsiteIcon implements IGetWebsiteIcon {
  constructor(
    private readonly websiteSettingsRepository: WebsiteSettingsRepository
  ) {}

  async execute(): Promise<WebsiteIcon | null> {
    const setting =
      await this.websiteSettingsRepository.getByKey('website-icon');
    const iconValue = setting.getValueAsIcon();

    if (!iconValue) {
      return null; // No icon as default
    }

    return new WebsiteIcon(iconValue.url, iconValue.metadata);
  }
}
