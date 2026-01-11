import { injectable, inject } from 'tsyringe';
import type { IEmailService } from '@/domain/email/services/IEmailService';
import type { IEmailSettingsRepository } from '@/domain/email/repositories/IEmailSettingsRepository';
import type { IAppointmentRepository } from '@/domain/appointment/repositories/IAppointmentRepository';
import {
  BaseAppointmentEmailUseCase,
  type BaseEmailInput,
  type EmailRecipient,
} from './shared/BaseAppointmentEmailUseCase';
import type { EmailTemplateType } from '@/domain/email/entities/EmailTemplate';
import type { Appointment } from '@/domain/appointment/entities/Appointment';

export interface ISendAppointmentReminderEmail {
  execute(input: BaseEmailInput): Promise<boolean>;
}

@injectable()
export class SendAppointmentReminderEmail
  extends BaseAppointmentEmailUseCase
  implements ISendAppointmentReminderEmail
{
  constructor(
    @inject('IEmailService')
    emailService: IEmailService,
    @inject('IEmailSettingsRepository')
    emailSettingsRepository: IEmailSettingsRepository,
    @inject('IAppointmentRepository')
    appointmentRepository: IAppointmentRepository
  ) {
    super(emailService, emailSettingsRepository, appointmentRepository);
  }

  async execute(input: BaseEmailInput): Promise<boolean> {
    const appointment = await this.appointmentRepository.findById(
      input.appointmentId
    );

    if (!appointment) {
      throw new Error('Rendez-vous non trouvé');
    }

    // Reminder-specific checks
    if (!appointment.status.isConfirmed()) {
      return false;
    }

    if (appointment.reminderSent) {
      return false;
    }

    // Send email using base class logic
    const success = await super.execute(input);

    // Mark reminder as sent if successful
    if (success) {
      const updatedAppointment = appointment.markReminderSent();
      await this.appointmentRepository.updateWithOptimisticLock(
        updatedAppointment
      );
    }

    return success;
  }

  protected getTemplateType(): EmailTemplateType {
    return 'appointment-reminder';
  }

  protected getRecipient(appointment: Appointment): EmailRecipient {
    return { to: appointment.clientInfo.email };
  }

  protected getLogMessage(): string {
    return "Échec de l'envoi de l'email de rappel de rendez-vous";
  }
}
