import { injectable, inject } from 'tsyringe';
import type { IEmailSettingsRepository } from '@/domain/email/repositories/IEmailSettingsRepository';
import { SmtpSettings } from '@/domain/email/entities/SmtpSettings';
import type { EncryptionType } from '@/domain/email/value-objects/EncryptionType';

export interface UpdateSmtpSettingsParams {
  host: string;
  port: number;
  username: string;
  password: string;
  encryptionType: EncryptionType;
}

export interface IUpdateSmtpSettings {
  execute(params: UpdateSmtpSettingsParams): Promise<void>;
}

@injectable()
export class UpdateSmtpSettings implements IUpdateSmtpSettings {
  constructor(
    @inject('IEmailSettingsRepository')
    private readonly repository: IEmailSettingsRepository
  ) {}

  async execute(params: UpdateSmtpSettingsParams): Promise<void> {
    const settings = SmtpSettings.create({
      host: params.host,
      port: params.port,
      username: params.username,
      password: params.password,
      encryptionType: params.encryptionType,
    });

    await this.repository.saveSmtpSettings(settings);
  }
}
