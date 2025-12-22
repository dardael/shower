import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type {
  IEmailService,
  SendEmailOptions,
  SendEmailResult,
} from '@/domain/email/services/IEmailService';
import type { SmtpSettings } from '@/domain/email/entities/SmtpSettings';
import type { IEmailSettingsRepository } from '@/domain/email/repositories/IEmailSettingsRepository';
import { injectable, inject } from 'tsyringe';

@injectable()
export class NodemailerEmailService implements IEmailService {
  constructor(
    @inject('IEmailSettingsRepository')
    private readonly emailSettingsRepository: IEmailSettingsRepository
  ) {}

  private createTransporter(smtpSettings: SmtpSettings): Transporter {
    const secure = smtpSettings.encryptionType === 'ssl';
    const requireTLS = smtpSettings.encryptionType === 'tls';

    return nodemailer.createTransport({
      host: smtpSettings.host,
      port: smtpSettings.port,
      secure,
      requireTLS,
      auth: {
        user: smtpSettings.username,
        pass: smtpSettings.password,
      },
    });
  }

  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      const smtpSettings = await this.emailSettingsRepository.getSmtpSettings();

      if (!smtpSettings.isConfigured()) {
        return {
          success: false,
          errorMessage: 'Configuration SMTP non définie',
        };
      }

      const transporter = this.createTransporter(smtpSettings);

      await transporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.body,
      });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur inconnue';
      return { success: false, errorMessage };
    }
  }

  async testConnection(testRecipientEmail: string): Promise<SendEmailResult> {
    try {
      const smtpSettings = await this.emailSettingsRepository.getSmtpSettings();

      if (!smtpSettings.isConfigured()) {
        return {
          success: false,
          errorMessage: 'Configuration SMTP non définie',
        };
      }

      const transporter = this.createTransporter(smtpSettings);

      // Verify connection first
      await transporter.verify();

      // Send a test email
      await transporter.sendMail({
        from: smtpSettings.username,
        to: testRecipientEmail,
        subject: 'Test de connexion SMTP',
        text: 'Ce message confirme que la configuration SMTP fonctionne correctement.',
      });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur inconnue';
      return {
        success: false,
        errorMessage: `Échec de connexion SMTP: ${errorMessage}`,
      };
    }
  }
}
