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

export interface ISendAppointmentCancellationEmail {
  execute(input: BaseEmailInput): Promise<boolean>;
}

@injectable()
export class SendAppointmentCancellationEmail
  extends BaseAppointmentEmailUseCase
  implements ISendAppointmentCancellationEmail
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

    if (!appointment.status.isCancelled()) {
      return false;
    }

    return super.execute(input);
  }

  protected getTemplateType(): EmailTemplateType {
    return 'appointment-cancellation';
  }

  protected getRecipient(appointment: Appointment): EmailRecipient {
    return { to: appointment.clientInfo.email };
  }

  protected getLogMessage(): string {
    return "Échec de l'envoi de l'email d'annulation de rendez-vous";
  }
}
