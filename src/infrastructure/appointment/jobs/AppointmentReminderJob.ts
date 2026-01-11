import { injectable, inject } from 'tsyringe';
import type { IAppointmentRepository } from '@/domain/appointment/repositories/IAppointmentRepository';
import type { IActivityRepository } from '@/domain/appointment/repositories/IActivityRepository';
import type { ISendAppointmentReminderEmail } from '@/application/appointment/SendAppointmentReminderEmail';
import { Logger } from '@/application/shared/Logger';
import {
  getStartOfDay,
  getEndOfDay,
  getNextDay,
  REMINDER_DEFAULTS,
} from '../constants';

export interface IAppointmentReminderJob {
  execute(): Promise<void>;
}

@injectable()
export class AppointmentReminderJob implements IAppointmentReminderJob {
  private readonly logger: Logger;

  constructor(
    @inject('IAppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository,
    @inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository,
    @inject('ISendAppointmentReminderEmail')
    private readonly sendAppointmentReminderEmail: ISendAppointmentReminderEmail
  ) {
    this.logger = new Logger();
  }

  async execute(): Promise<void> {
    const now = new Date();
    const appointmentsToRemind =
      await this.getAppointmentsNeedingReminders(now);

    if (appointmentsToRemind.length === 0) {
      this.logger.info('Aucun rendez-vous ne nécessite de rappel');
      return;
    }

    this.logger.info(
      `Envoi de rappels pour ${appointmentsToRemind.length} rendez-vous`
    );

    for (const appointment of appointmentsToRemind) {
      await this.processAppointmentReminder(appointment, now);
    }
  }

  private async getAppointmentsNeedingReminders(
    now: Date
  ): Promise<Awaited<ReturnType<IAppointmentRepository['findByDateRange']>>> {
    const tomorrow = getNextDay(now);
    const tomorrowStart = getStartOfDay(tomorrow);
    const tomorrowEnd = getEndOfDay(tomorrow);

    const appointments = await this.appointmentRepository.findByDateRange(
      tomorrowStart,
      tomorrowEnd
    );

    return appointments.filter(
      (apt) => apt.status.isConfirmed() && !apt.reminderSent
    );
  }

  private async processAppointmentReminder(
    appointment: Awaited<
      ReturnType<IAppointmentRepository['findByDateRange']>
    >[number],
    now: Date
  ): Promise<void> {
    try {
      const activity = await this.activityRepository.findById(
        appointment.activityId
      );

      if (!activity) {
        this.logger.warn(
          `Activité introuvable pour le rendez-vous ${appointment.id}, rappel ignoré`
        );
        return;
      }

      if (!activity.reminderSettings.enabled) {
        this.logger.info(
          `Rappels désactivés pour l'activité ${activity.name}, ignoré`
        );
        return;
      }

      const reminderHoursBefore =
        activity.reminderSettings.hoursBefore ?? REMINDER_DEFAULTS.HOURS_BEFORE;
      const hoursUntilAppointment =
        (appointment.dateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntilAppointment > reminderHoursBefore) {
        this.logger.info(
          `Trop tôt pour envoyer le rappel pour le rendez-vous ${appointment.id}`
        );
        return;
      }

      if (!appointment.id) {
        this.logger.warn("Le rendez-vous n'a pas d'ID, rappel ignoré");
        return;
      }

      await this.sendReminder(appointment.id);
    } catch (error) {
      this.logger.logErrorWithObject(
        error,
        `Erreur lors de l'envoi du rappel pour le rendez-vous ${appointment.id}`
      );
    }
  }

  private async sendReminder(appointmentId: string): Promise<void> {
    const success = await this.sendAppointmentReminderEmail.execute({
      appointmentId,
    });

    if (success) {
      this.logger.info(`Rappel envoyé pour le rendez-vous ${appointmentId}`);
    } else {
      this.logger.warn(
        `Échec de l'envoi du rappel pour le rendez-vous ${appointmentId}`
      );
    }
  }
}
