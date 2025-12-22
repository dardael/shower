import { injectable, inject } from 'tsyringe';
import type { IEmailSettingsRepository } from '@/domain/email/repositories/IEmailSettingsRepository';
import { EmailSettings } from '@/domain/email/entities/EmailSettings';

export interface UpdateEmailSettingsParams {
  administratorEmail: string;
}

export interface IUpdateEmailSettings {
  execute(params: UpdateEmailSettingsParams): Promise<void>;
}

@injectable()
export class UpdateEmailSettings implements IUpdateEmailSettings {
  constructor(
    @inject('IEmailSettingsRepository')
    private readonly repository: IEmailSettingsRepository
  ) {}

  async execute(params: UpdateEmailSettingsParams): Promise<void> {
    const settings = EmailSettings.create({
      administratorEmail: params.administratorEmail,
    });

    await this.repository.saveEmailSettings(settings);
  }
}
