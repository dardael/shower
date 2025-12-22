import { injectable, inject } from 'tsyringe';
import type { IEmailSettingsRepository } from '@/domain/email/repositories/IEmailSettingsRepository';
import type { IEmailService } from '@/domain/email/services/IEmailService';
import type { Order } from '@/domain/order/entities/Order';
import { PlaceholderReplacer } from '@/infrastructure/email/services/PlaceholderReplacer';
import { EmailLog } from '@/domain/email/entities/EmailLog';

export interface SendOrderNotificationEmailsResult {
  adminEmailSent: boolean;
  purchaserEmailSent: boolean;
  adminError?: string;
  purchaserError?: string;
}

export interface ISendOrderNotificationEmails {
  execute(order: Order): Promise<SendOrderNotificationEmailsResult>;
}

@injectable()
export class SendOrderNotificationEmails
  implements ISendOrderNotificationEmails
{
  constructor(
    @inject('IEmailSettingsRepository')
    private readonly repository: IEmailSettingsRepository,
    @inject('IEmailService')
    private readonly emailService: IEmailService,
    @inject('PlaceholderReplacer')
    private readonly placeholderReplacer: PlaceholderReplacer
  ) {}

  async execute(order: Order): Promise<SendOrderNotificationEmailsResult> {
    const result: SendOrderNotificationEmailsResult = {
      adminEmailSent: false,
      purchaserEmailSent: false,
    };

    const [smtpSettings, emailSettings, adminTemplate, purchaserTemplate] =
      await Promise.all([
        this.repository.getSmtpSettings(),
        this.repository.getEmailSettings(),
        this.repository.getEmailTemplate('admin'),
        this.repository.getEmailTemplate('purchaser'),
      ]);

    if (!smtpSettings || !smtpSettings.isConfigured()) {
      result.adminError = 'SMTP settings not configured';
      result.purchaserError = 'SMTP settings not configured';
      return result;
    }

    if (!emailSettings) {
      result.adminError = 'Email settings not configured';
      result.purchaserError = 'Email settings not configured';
      return result;
    }

    const senderEmail = smtpSettings.username;

    // Send admin notification
    if (adminTemplate?.enabled) {
      try {
        const subject = this.placeholderReplacer.replacePlaceholders(
          adminTemplate.subject,
          order
        );
        const body = this.placeholderReplacer.replacePlaceholders(
          adminTemplate.body,
          order
        );

        const sendResult = await this.emailService.sendEmail({
          from: senderEmail,
          to: emailSettings.administratorEmail,
          subject,
          body,
        });

        result.adminEmailSent = sendResult.success;
        if (!sendResult.success) {
          result.adminError = sendResult.errorMessage;
        }
        await this.logEmailResult(
          order.id,
          'admin',
          emailSettings.administratorEmail,
          subject,
          sendResult.success,
          sendResult.errorMessage
        );
      } catch (error) {
        result.adminError =
          error instanceof Error ? error.message : 'Unknown error';
        await this.logEmailResult(
          order.id,
          'admin',
          emailSettings.administratorEmail,
          adminTemplate.subject,
          false,
          result.adminError
        );
      }
    }

    // Send purchaser notification
    if (purchaserTemplate?.enabled) {
      try {
        const subject = this.placeholderReplacer.replacePlaceholders(
          purchaserTemplate.subject,
          order
        );
        const body = this.placeholderReplacer.replacePlaceholders(
          purchaserTemplate.body,
          order
        );

        const sendResult = await this.emailService.sendEmail({
          from: senderEmail,
          to: order.customerEmail,
          subject,
          body,
        });

        result.purchaserEmailSent = sendResult.success;
        if (!sendResult.success) {
          result.purchaserError = sendResult.errorMessage;
        }
        await this.logEmailResult(
          order.id,
          'purchaser',
          order.customerEmail,
          subject,
          sendResult.success,
          sendResult.errorMessage
        );
      } catch (error) {
        result.purchaserError =
          error instanceof Error ? error.message : 'Unknown error';
        await this.logEmailResult(
          order.id,
          'purchaser',
          order.customerEmail,
          purchaserTemplate.subject,
          false,
          result.purchaserError
        );
      }
    }

    return result;
  }

  private async logEmailResult(
    orderId: string,
    type: 'admin' | 'purchaser',
    recipient: string,
    subject: string,
    success: boolean,
    errorMessage?: string
  ): Promise<void> {
    try {
      const log = success
        ? EmailLog.createSent(orderId, type, recipient, subject)
        : EmailLog.createFailed(
            orderId,
            type,
            recipient,
            subject,
            errorMessage || 'Unknown error'
          );
      await this.repository.saveEmailLog(log);
    } catch (logError) {
      console.error(
        `Failed to log email ${success ? 'success' : 'failure'}:`,
        logError
      );
    }
  }
}
