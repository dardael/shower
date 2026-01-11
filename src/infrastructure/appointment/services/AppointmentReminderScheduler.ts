import { injectable, inject } from 'tsyringe';
import * as cron from 'node-cron';
import type { IAppointmentRepository } from '@/domain/appointment/repositories/IAppointmentRepository';
import type { IActivityRepository } from '@/domain/appointment/repositories/IActivityRepository';
import { SendAppointmentReminderEmail } from '@/application/appointment/SendAppointmentReminderEmail';
import { Logger } from '@/application/shared/Logger';
import {
  CRON_EXPRESSIONS,
  REMINDER_DEFAULTS,
  TIME_VALUES,
  calculateReminderTime,
} from '../constants';

export interface IAppointmentReminderScheduler {
  schedule(): void;
  stop(): void;
  isRunning(): boolean;
}

@injectable()
export class AppointmentReminderScheduler
  implements IAppointmentReminderScheduler
{
  private scheduledTask: ReturnType<typeof cron.schedule> | null = null;
  private readonly logger = new Logger();

  constructor(
    @inject('IAppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository,
    @inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository,
    @inject(SendAppointmentReminderEmail)
    private readonly sendAppointmentReminder: SendAppointmentReminderEmail
  ) {}

  schedule(): void {
    if (this.scheduledTask) {
      this.logger.warn(
        "Tentative de programmation du planificateur de rappels de rendez-vous alors qu'il est déjà en cours d'exécution"
      );
      return;
    }

    // Exécute selon l'intervalle configuré (par défaut toutes les heures)
    this.scheduledTask = cron.schedule(
      CRON_EXPRESSIONS.APPOINTMENT_REMINDER,
      async () => {
        try {
          await this.processReminders();
        } catch (error) {
          this.logger.logErrorWithObject(
            error,
            'Erreur lors du traitement des rappels de rendez-vous'
          );
        }
      }
    );

    this.logger.info('Planificateur de rappels de rendez-vous démarré');
  }

  stop(): void {
    if (this.scheduledTask) {
      this.scheduledTask.stop();
      this.scheduledTask = null;
      this.logger.info('Planificateur de rappels de rendez-vous arrêté');
    }
  }

  isRunning(): boolean {
    return this.scheduledTask !== null;
  }

  private async processReminders(): Promise<void> {
    this.logger.info('Traitement des rappels de rendez-vous en cours...');

    const now = new Date();
    const checkWindowStart = new Date(
      now.getTime() +
        REMINDER_DEFAULTS.HOURS_BEFORE * TIME_VALUES.MILLISECONDS_PER_HOUR
    );
    const checkWindowEnd = new Date(
      checkWindowStart.getTime() +
        REMINDER_DEFAULTS.CHECK_WINDOW_HOURS * TIME_VALUES.MILLISECONDS_PER_HOUR
    );

    const appointments = await this.appointmentRepository.findByDateRange(
      checkWindowStart,
      checkWindowEnd
    );
    const confirmedAppointments = appointments.filter(
      (apt) =>
        apt.status.value === 'confirmed' &&
        apt.dateTime > now &&
        apt.dateTime <= checkWindowEnd
    );

    this.logger.info(
      `${confirmedAppointments.length} rendez-vous confirmés trouvés dans la fenêtre de vérification`
    );

    // Batch query all activities upfront to avoid N+1 problem
    const allActivities = await this.activityRepository.findAll();
    const activityMap = new Map(
      allActivities.map((activity) => [activity.id!, activity])
    );

    for (const appointment of confirmedAppointments) {
      const activity = activityMap.get(appointment.activityId);

      if (!activity || !activity.reminderSettings.enabled) {
        continue;
      }

      const hoursBefore =
        activity.reminderSettings.hoursBefore ?? REMINDER_DEFAULTS.HOURS_BEFORE;
      const reminderTime = calculateReminderTime(
        appointment.dateTime,
        hoursBefore
      );

      // Check if it's time to send the reminder (within the current hour)
      const hourFromNow = new Date(
        now.getTime() + TIME_VALUES.MILLISECONDS_PER_HOUR
      );
      if (reminderTime >= now && reminderTime < hourFromNow) {
        if (!appointment.id) {
          this.logger.warn(
            "Rendez-vous sans ID trouvé, impossible d'envoyer le rappel"
          );
          continue;
        }

        this.logger.info(
          `Envoi du rappel pour le rendez-vous ${appointment.id} (${hoursBefore}h avant)`
        );

        try {
          await this.sendAppointmentReminder.execute({
            appointmentId: appointment.id,
          });
        } catch (error) {
          this.logger.logErrorWithObject(
            error,
            `Erreur lors de l'envoi du rappel pour le rendez-vous ${appointment.id}`
          );
        }
      }
    }

    this.logger.info('Traitement des rappels terminé');
  }
}
