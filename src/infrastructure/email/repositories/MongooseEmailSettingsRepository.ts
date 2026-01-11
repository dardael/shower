import { injectable, inject } from 'tsyringe';
import { IEmailSettingsRepository } from '@/domain/email/repositories/IEmailSettingsRepository';
import { SmtpSettings } from '@/domain/email/entities/SmtpSettings';
import { EmailSettings } from '@/domain/email/entities/EmailSettings';
import {
  EmailTemplate,
  EmailTemplateType,
} from '@/domain/email/entities/EmailTemplate';
import { EmailLog } from '@/domain/email/entities/EmailLog';
import {
  ENCRYPTION_TYPES,
  EncryptionType,
} from '@/domain/email/value-objects/EncryptionType';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';
import { EmailLogModel } from '../models/EmailLogModel';
import {
  encryptPassword,
  decryptPassword,
} from '../services/PasswordEncryption';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';

@injectable()
export class MongooseEmailSettingsRepository
  implements IEmailSettingsRepository
{
  constructor(
    @inject('WebsiteSettingsRepository')
    private readonly settingsRepository: WebsiteSettingsRepository
  ) {}

  async getSmtpSettings(): Promise<SmtpSettings> {
    const [host, port, username, password, encryption] = await Promise.all([
      this.settingsRepository.getByKey(VALID_SETTING_KEYS.EMAIL_SMTP_HOST),
      this.settingsRepository.getByKey(VALID_SETTING_KEYS.EMAIL_SMTP_PORT),
      this.settingsRepository.getByKey(VALID_SETTING_KEYS.EMAIL_SMTP_USERNAME),
      this.settingsRepository.getByKey(VALID_SETTING_KEYS.EMAIL_SMTP_PASSWORD),
      this.settingsRepository.getByKey(
        VALID_SETTING_KEYS.EMAIL_SMTP_ENCRYPTION
      ),
    ]);

    if (!host && !port && !username && !password) {
      return SmtpSettings.createDefault();
    }

    return SmtpSettings.create({
      host: host?.getValueAsString() || '',
      port: port ? parseInt(port.getValueAsString(), 10) : 587,
      username: username?.getValueAsString() || '',
      password: decryptPassword(password?.getValueAsString() || ''),
      encryptionType:
        (encryption?.getValueAsString() as EncryptionType) ||
        ENCRYPTION_TYPES.TLS,
    });
  }

  async saveSmtpSettings(settings: SmtpSettings): Promise<void> {
    await Promise.all([
      this.settingsRepository.setByKey(
        VALID_SETTING_KEYS.EMAIL_SMTP_HOST,
        settings.host
      ),
      this.settingsRepository.setByKey(
        VALID_SETTING_KEYS.EMAIL_SMTP_PORT,
        settings.port.toString()
      ),
      this.settingsRepository.setByKey(
        VALID_SETTING_KEYS.EMAIL_SMTP_USERNAME,
        settings.username
      ),
      this.settingsRepository.setByKey(
        VALID_SETTING_KEYS.EMAIL_SMTP_PASSWORD,
        encryptPassword(settings.password)
      ),
      this.settingsRepository.setByKey(
        VALID_SETTING_KEYS.EMAIL_SMTP_ENCRYPTION,
        settings.encryptionType
      ),
    ]);
  }

  async getEmailSettings(): Promise<EmailSettings> {
    const [adminEmail] = await Promise.all([
      this.settingsRepository.getByKey(VALID_SETTING_KEYS.EMAIL_ADMIN_ADDRESS),
    ]);

    if (!adminEmail) {
      return EmailSettings.createDefault();
    }

    return EmailSettings.create({
      administratorEmail: adminEmail?.getValueAsString() || '',
    });
  }

  async saveEmailSettings(settings: EmailSettings): Promise<void> {
    await this.settingsRepository.setByKey(
      VALID_SETTING_KEYS.EMAIL_ADMIN_ADDRESS,
      settings.administratorEmail
    );
  }

  async getEmailTemplate(type: EmailTemplateType): Promise<EmailTemplate> {
    const keys =
      type === 'admin'
        ? {
            subject: VALID_SETTING_KEYS.EMAIL_TEMPLATE_ADMIN_SUBJECT,
            body: VALID_SETTING_KEYS.EMAIL_TEMPLATE_ADMIN_BODY,
            enabled: VALID_SETTING_KEYS.EMAIL_TEMPLATE_ADMIN_ENABLED,
          }
        : type === 'purchaser'
          ? {
              subject: VALID_SETTING_KEYS.EMAIL_TEMPLATE_PURCHASER_SUBJECT,
              body: VALID_SETTING_KEYS.EMAIL_TEMPLATE_PURCHASER_BODY,
              enabled: VALID_SETTING_KEYS.EMAIL_TEMPLATE_PURCHASER_ENABLED,
            }
          : type === 'appointment-booking'
            ? {
                subject:
                  VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_CONFIRMATION_SUBJECT,
                body: VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_CONFIRMATION_BODY,
                enabled:
                  VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_CONFIRMATION_ENABLED,
              }
            : type === 'appointment-admin-new'
              ? {
                  subject:
                    VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_ADMIN_NEW_SUBJECT,
                  body: VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_ADMIN_NEW_BODY,
                  enabled:
                    VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_ADMIN_NEW_ENABLED,
                }
              : type === 'appointment-admin-confirmation'
                ? {
                    subject:
                      VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_ADMIN_CONFIRMATION_SUBJECT,
                    body: VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_ADMIN_CONFIRMATION_BODY,
                    enabled:
                      VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_ADMIN_CONFIRMATION_ENABLED,
                  }
                : type === 'appointment-reminder'
                  ? {
                      subject:
                        VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_REMINDER_SUBJECT,
                      body: VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_REMINDER_BODY,
                      enabled:
                        VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_REMINDER_ENABLED,
                    }
                  : type === 'appointment-cancellation'
                    ? {
                        subject:
                          VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_CANCELLATION_SUBJECT,
                        body: VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_CANCELLATION_BODY,
                        enabled:
                          VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_CANCELLATION_ENABLED,
                      }
                    : {
                        subject:
                          VALID_SETTING_KEYS.EMAIL_TEMPLATE_PURCHASER_SUBJECT,
                        body: VALID_SETTING_KEYS.EMAIL_TEMPLATE_PURCHASER_BODY,
                        enabled:
                          VALID_SETTING_KEYS.EMAIL_TEMPLATE_PURCHASER_ENABLED,
                      };

    const [subject, body, enabled] = await Promise.all([
      this.settingsRepository.getByKey(keys.subject),
      this.settingsRepository.getByKey(keys.body),
      this.settingsRepository.getByKey(keys.enabled),
    ]);

    if (!subject && !body) {
      return EmailTemplate.createDefault(type);
    }

    const defaultTemplate = EmailTemplate.createDefault(type);
    return EmailTemplate.create({
      type,
      subject: subject?.getValueAsString() || defaultTemplate.subject,
      body: body?.getValueAsString() || defaultTemplate.body,
      enabled: enabled?.getValueAsString() === 'true',
    });
  }

  async saveEmailTemplate(template: EmailTemplate): Promise<void> {
    const keys =
      template.type === 'admin'
        ? {
            subject: VALID_SETTING_KEYS.EMAIL_TEMPLATE_ADMIN_SUBJECT,
            body: VALID_SETTING_KEYS.EMAIL_TEMPLATE_ADMIN_BODY,
            enabled: VALID_SETTING_KEYS.EMAIL_TEMPLATE_ADMIN_ENABLED,
          }
        : template.type === 'purchaser'
          ? {
              subject: VALID_SETTING_KEYS.EMAIL_TEMPLATE_PURCHASER_SUBJECT,
              body: VALID_SETTING_KEYS.EMAIL_TEMPLATE_PURCHASER_BODY,
              enabled: VALID_SETTING_KEYS.EMAIL_TEMPLATE_PURCHASER_ENABLED,
            }
          : template.type === 'appointment-booking'
            ? {
                subject:
                  VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_CONFIRMATION_SUBJECT,
                body: VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_CONFIRMATION_BODY,
                enabled:
                  VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_CONFIRMATION_ENABLED,
              }
            : template.type === 'appointment-admin-new'
              ? {
                  subject:
                    VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_ADMIN_NEW_SUBJECT,
                  body: VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_ADMIN_NEW_BODY,
                  enabled:
                    VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_ADMIN_NEW_ENABLED,
                }
              : template.type === 'appointment-admin-confirmation'
                ? {
                    subject:
                      VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_ADMIN_CONFIRMATION_SUBJECT,
                    body: VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_ADMIN_CONFIRMATION_BODY,
                    enabled:
                      VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_ADMIN_CONFIRMATION_ENABLED,
                  }
                : template.type === 'appointment-reminder'
                  ? {
                      subject:
                        VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_REMINDER_SUBJECT,
                      body: VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_REMINDER_BODY,
                      enabled:
                        VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_REMINDER_ENABLED,
                    }
                  : template.type === 'appointment-cancellation'
                    ? {
                        subject:
                          VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_CANCELLATION_SUBJECT,
                        body: VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_CANCELLATION_BODY,
                        enabled:
                          VALID_SETTING_KEYS.EMAIL_TEMPLATE_APPOINTMENT_CANCELLATION_ENABLED,
                      }
                    : {
                        subject:
                          VALID_SETTING_KEYS.EMAIL_TEMPLATE_PURCHASER_SUBJECT,
                        body: VALID_SETTING_KEYS.EMAIL_TEMPLATE_PURCHASER_BODY,
                        enabled:
                          VALID_SETTING_KEYS.EMAIL_TEMPLATE_PURCHASER_ENABLED,
                      };

    await Promise.all([
      this.settingsRepository.setByKey(keys.subject, template.subject),
      this.settingsRepository.setByKey(keys.body, template.body),
      this.settingsRepository.setByKey(
        keys.enabled,
        template.enabled.toString()
      ),
    ]);
  }

  async saveEmailLog(log: EmailLog): Promise<void> {
    await EmailLogModel.create({
      logId: log.id,
      orderId: log.orderId,
      type: log.type,
      recipient: log.recipient,
      subject: log.subject,
      status: log.status,
      errorMessage: log.errorMessage,
      sentAt: log.sentAt,
    });
  }

  async getEmailLogs(options: {
    page: number;
    limit: number;
    status?: 'sent' | 'failed' | 'all';
    orderId?: string;
  }): Promise<{ logs: EmailLog[]; total: number }> {
    const query: Record<string, unknown> = {};

    if (options.status && options.status !== 'all') {
      query.status = options.status;
    }
    if (options.orderId) {
      query.orderId = options.orderId;
    }

    const skip = (options.page - 1) * options.limit;

    const [documents, total] = await Promise.all([
      EmailLogModel.find(query)
        .sort({ sentAt: -1 })
        .skip(skip)
        .limit(options.limit)
        .lean(),
      EmailLogModel.countDocuments(query),
    ]);

    const logs = documents.map((doc) =>
      EmailLog.create({
        id: doc.logId,
        orderId: doc.orderId,
        type: doc.type,
        recipient: doc.recipient,
        subject: doc.subject,
        status: doc.status,
        errorMessage: doc.errorMessage,
        sentAt: doc.sentAt,
      })
    );

    return { logs, total };
  }
}
