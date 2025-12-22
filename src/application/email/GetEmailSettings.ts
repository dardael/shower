import { injectable, inject } from 'tsyringe';
import type { IEmailSettingsRepository } from '@/domain/email/repositories/IEmailSettingsRepository';
import { EmailSettings } from '@/domain/email/entities/EmailSettings';

export interface IGetEmailSettings {
  execute(): Promise<EmailSettings>;
}

@injectable()
export class GetEmailSettings implements IGetEmailSettings {
  constructor(
    @inject('IEmailSettingsRepository')
    private readonly repository: IEmailSettingsRepository
  ) {}

  async execute(): Promise<EmailSettings> {
    return this.repository.getEmailSettings();
  }
}
