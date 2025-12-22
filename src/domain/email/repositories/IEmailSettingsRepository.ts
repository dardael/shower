import { SmtpSettings } from '../entities/SmtpSettings';
import { EmailSettings } from '../entities/EmailSettings';
import { EmailTemplate, EmailTemplateType } from '../entities/EmailTemplate';
import { EmailLog } from '../entities/EmailLog';

export interface IEmailSettingsRepository {
  getSmtpSettings(): Promise<SmtpSettings>;
  saveSmtpSettings(settings: SmtpSettings): Promise<void>;

  getEmailSettings(): Promise<EmailSettings>;
  saveEmailSettings(settings: EmailSettings): Promise<void>;

  getEmailTemplate(type: EmailTemplateType): Promise<EmailTemplate>;
  saveEmailTemplate(template: EmailTemplate): Promise<void>;

  saveEmailLog(log: EmailLog): Promise<void>;
  getEmailLogs(options: {
    page: number;
    limit: number;
    status?: 'sent' | 'failed' | 'all';
    orderId?: string;
  }): Promise<{ logs: EmailLog[]; total: number }>;
}
