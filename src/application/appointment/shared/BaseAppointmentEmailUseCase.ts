import { inject } from 'tsyringe';
import type { IEmailService } from '@/domain/email/services/IEmailService';
import type { IEmailSettingsRepository } from '@/domain/email/repositories/IEmailSettingsRepository';
import type { IAppointmentRepository } from '@/domain/appointment/repositories/IAppointmentRepository';
import { Logger } from '@/application/shared/Logger';
import { EmailLog } from '@/domain/email/entities/EmailLog';
import { AppointmentEmailHelper } from './AppointmentEmailHelper';
import type { Appointment } from '@/domain/appointment/entities/Appointment';
import type { EmailTemplateType } from '@/domain/email/entities/EmailTemplate';

export interface BaseEmailInput {
  appointmentId: string;
}

export interface EmailRecipient {
  to: string;
}

export abstract class BaseAppointmentEmailUseCase {
  protected readonly logger = new Logger();

  constructor(
    @inject('IEmailService')
    protected readonly emailService: IEmailService,
    @inject('IEmailSettingsRepository')
    protected readonly emailSettingsRepository: IEmailSettingsRepository,
    @inject('IAppointmentRepository')
    protected readonly appointmentRepository: IAppointmentRepository
  ) {}

  protected abstract getTemplateType(): EmailTemplateType;
  protected abstract getRecipient(
    appointment: Appointment,
    administratorEmail?: string
  ): EmailRecipient;
  protected abstract getLogMessage(): string;

  async execute(input: BaseEmailInput): Promise<boolean> {
    const appointment = await this.appointmentRepository.findById(
      input.appointmentId
    );

    if (!appointment) {
      throw new Error('Rendez-vous non trouvé');
    }

    const emailSettings = await this.emailSettingsRepository.getEmailSettings();
    const smtpSettings = await this.emailSettingsRepository.getSmtpSettings();
    const templateType = this.getTemplateType();
    const template =
      await this.emailSettingsRepository.getEmailTemplate(templateType);

    if (!smtpSettings.isConfigured() || !emailSettings.isConfigured()) {
      this.logger.warn(
        'Paramètres email non configurés, email de confirmation ignoré'
      );
      return false;
    }

    if (!template.enabled) {
      this.logger.warn('Template email désactivé, email ignoré');
      return false;
    }

    const { to } = this.getRecipient(
      appointment,
      emailSettings.administratorEmail
    );

    const appointmentDate = AppointmentEmailHelper.formatDate(
      appointment.dateTime
    );
    const appointmentTime = AppointmentEmailHelper.formatTime(
      appointment.dateTime
    );
    const endTime = AppointmentEmailHelper.formatTime(appointment.endDateTime);

    const templateVars = {
      '{{customer_name}}': appointment.clientInfo.name,
      '{{appointment_activity}}': appointment.activityName,
      '{{appointment_date}}': appointmentDate,
      '{{appointment_time}}': `${appointmentTime} - ${endTime}`,
      '{{appointment_duration}}': `${appointment.activityDurationMinutes} minutes`,
      '{{customer_email}}': appointment.clientInfo.email,
      '{{customer_phone}}': appointment.clientInfo.phone || 'Non renseigné',
      '{{customer_notes}}': appointment.clientInfo.customField || 'Aucune',
    };

    const { subject, body } = AppointmentEmailHelper.replaceTemplateVariables(
      template.subject,
      template.body,
      templateVars
    );

    try {
      const result = await this.emailService.sendEmail({
        from: emailSettings.administratorEmail,
        to,
        subject,
        body,
      });

      await this.logEmailResult(
        input.appointmentId,
        templateType,
        to,
        subject,
        result.success,
        result.errorMessage
      );

      return result.success;
    } catch (error) {
      this.logger.logErrorWithObject(error, this.getLogMessage());

      const errorMessage =
        error instanceof Error ? error.message : 'Erreur inconnue';

      await this.logEmailResult(
        input.appointmentId,
        templateType,
        to,
        subject,
        false,
        errorMessage
      );

      return false;
    }
  }

  private async logEmailResult(
    appointmentId: string,
    type: EmailTemplateType,
    recipient: string,
    subject: string,
    success: boolean,
    errorMessage?: string
  ): Promise<void> {
    try {
      const log = success
        ? EmailLog.createSent(appointmentId, type, recipient, subject)
        : EmailLog.createFailed(
            appointmentId,
            type,
            recipient,
            subject,
            errorMessage || 'Erreur inconnue'
          );

      await this.emailSettingsRepository.saveEmailLog(log);
    } catch (error) {
      this.logger.logErrorWithObject(
        error,
        "Erreur lors de la journalisation de l'email"
      );
    }
  }
}
