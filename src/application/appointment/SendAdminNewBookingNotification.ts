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

export interface ISendAdminNewBookingNotification {
  execute(input: BaseEmailInput): Promise<boolean>;
}

@injectable()
export class SendAdminNewBookingNotification
  extends BaseAppointmentEmailUseCase
  implements ISendAdminNewBookingNotification
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

  protected getTemplateType(): EmailTemplateType {
    return 'appointment-admin-new';
  }

  protected getRecipient(
    _appointment: Appointment,
    administratorEmail: string
  ): EmailRecipient {
    return { to: administratorEmail };
  }

  protected getLogMessage(): string {
    return "Échec de l'envoi de la notification de nouvelle réservation à l'administrateur";
  }
}
