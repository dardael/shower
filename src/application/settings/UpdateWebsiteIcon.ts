import 'reflect-metadata';
import { injectable } from 'tsyringe';
import type { IUpdateWebsiteIcon } from './IUpdateWebsiteIcon';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';

@injectable()
export class UpdateWebsiteIcon implements IUpdateWebsiteIcon {
  constructor(
    private readonly websiteSettingsRepository: WebsiteSettingsRepository
  ) {}

  async execute(key: string, icon: WebsiteIcon | null): Promise<void> {
    await this.websiteSettingsRepository.updateIcon(key, icon);
  }
}
