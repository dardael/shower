import { inject, injectable } from 'tsyringe';
import type { IEmailSettingsRepository } from '@/domain/email/repositories/IEmailSettingsRepository';

export interface EmailConfigurationStatus {
  smtpConfigured: boolean;
  adminEmailConfigured: boolean;
  adminTemplateEnabled: boolean;
  purchaserTemplateEnabled: boolean;
  isFullyConfigured: boolean;
  details: {
    smtpHost: string | null;
    smtpPort: number | null;
    adminEmail: string | null;
    senderEmail: string | null;
  };
}

@injectable()
export class GetEmailConfigurationStatus {
  constructor(
    @inject('IEmailSettingsRepository')
    private readonly repository: IEmailSettingsRepository
  ) {}

  async execute(): Promise<EmailConfigurationStatus> {
    const smtpSettings = await this.repository.getSmtpSettings();
    const emailSettings = await this.repository.getEmailSettings();
    const adminTemplate = await this.repository.getEmailTemplate('admin');
    const purchaserTemplate =
      await this.repository.getEmailTemplate('purchaser');

    const smtpConfigured = Boolean(
      smtpSettings?.host &&
        smtpSettings?.port &&
        smtpSettings?.username &&
        smtpSettings?.password
    );

    const adminEmailConfigured = Boolean(emailSettings?.administratorEmail);
    const adminTemplateEnabled = adminTemplate?.enabled ?? false;
    const purchaserTemplateEnabled = purchaserTemplate?.enabled ?? false;

    const isFullyConfigured =
      smtpConfigured &&
      adminEmailConfigured &&
      (adminTemplateEnabled || purchaserTemplateEnabled);

    return {
      smtpConfigured,
      adminEmailConfigured,
      adminTemplateEnabled,
      purchaserTemplateEnabled,
      isFullyConfigured,
      details: {
        smtpHost: smtpSettings?.host ?? null,
        smtpPort: smtpSettings?.port ?? null,
        adminEmail: emailSettings?.administratorEmail ?? null,
        senderEmail: smtpSettings?.username ?? null,
      },
    };
  }
}
