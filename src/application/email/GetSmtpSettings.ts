import { injectable, inject } from 'tsyringe';
import type { IEmailSettingsRepository } from '@/domain/email/repositories/IEmailSettingsRepository';
import { SmtpSettings } from '@/domain/email/entities/SmtpSettings';

export interface IGetSmtpSettings {
  execute(): Promise<SmtpSettings>;
}

@injectable()
export class GetSmtpSettings implements IGetSmtpSettings {
  constructor(
    @inject('IEmailSettingsRepository')
    private readonly repository: IEmailSettingsRepository
  ) {}

  async execute(): Promise<SmtpSettings> {
    return this.repository.getSmtpSettings();
  }
}
