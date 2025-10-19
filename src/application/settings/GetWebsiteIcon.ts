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

  async execute(key: string): Promise<WebsiteIcon | null> {
    return await this.websiteSettingsRepository.getIcon(key);
  }
}
