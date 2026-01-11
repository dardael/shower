import { inject, injectable } from 'tsyringe';
import type { IAppointmentRepository } from '@/domain/appointment/repositories/IAppointmentRepository';
import type { IActivityRepository } from '@/domain/appointment/repositories/IActivityRepository';
import { Appointment } from '@/domain/appointment/entities/Appointment';
import { AppointmentStatus } from '@/domain/appointment/value-objects/AppointmentStatus';
import { ClientInfo } from '@/domain/appointment/value-objects/ClientInfo';
import { CALENDAR_CONSTANTS, hoursToMs } from './constants';

interface CreateAppointmentInput {
  activityId: string;
  dateTime: Date;
  clientInfo: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    customField?: string;
  };
}

export interface ICreateAppointment {
  execute(input: CreateAppointmentInput): Promise<Appointment>;
}

@injectable()
export class CreateAppointment implements ICreateAppointment {
  constructor(
    @inject('IAppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository,
    @inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository
  ) {}

  async execute(input: CreateAppointmentInput): Promise<Appointment> {
    const activity = await this.activityRepository.findById(input.activityId);
    if (!activity) {
      throw new Error('Activité non trouvée');
    }

    const now = new Date();
    const minNoticeMs = hoursToMs(activity.minimumBookingNoticeHours);
    if (input.dateTime.getTime() - now.getTime() < minNoticeMs) {
      throw new Error(
        `La réservation doit être effectuée au moins ${activity.minimumBookingNoticeHours} heures à l'avance`
      );
    }

    const hasOverlap =
      await this.appointmentRepository.hasOverlappingAppointment(
        input.dateTime,
        activity.durationMinutes
      );

    if (hasOverlap) {
      throw new Error("Ce créneau n'est plus disponible");
    }

    const clientInfo = ClientInfo.create({
      name: input.clientInfo.name,
      email: input.clientInfo.email,
      phone: input.clientInfo.phone,
      address: input.clientInfo.address,
      customField: input.clientInfo.customField,
    });

    const appointment = Appointment.create({
      activityId: input.activityId,
      activityName: activity.name,
      activityDurationMinutes: activity.durationMinutes,
      clientInfo,
      dateTime: input.dateTime,
      status: AppointmentStatus.pending(),
    });

    return this.appointmentRepository.save(appointment);
  }
}

export interface IGetAllAppointments {
  execute(): Promise<Appointment[]>;
}

@injectable()
export class GetAllAppointments implements IGetAllAppointments {
  constructor(
    @inject('IAppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository
  ) {}

  async execute(): Promise<Appointment[]> {
    return this.appointmentRepository.findAll();
  }
}

export interface IGetAppointmentById {
  execute(id: string): Promise<Appointment | null>;
}

@injectable()
export class GetAppointmentById implements IGetAppointmentById {
  constructor(
    @inject('IAppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository
  ) {}

  async execute(id: string): Promise<Appointment | null> {
    return this.appointmentRepository.findById(id);
  }
}

export interface IConfirmAppointment {
  execute(id: string): Promise<Appointment>;
}

@injectable()
export class ConfirmAppointment implements IConfirmAppointment {
  constructor(
    @inject('IAppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository
  ) {}

  async execute(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new Error('Rendez-vous non trouvé');
    }

    const confirmedAppointment = appointment.confirm();
    return this.appointmentRepository.updateWithOptimisticLock(
      confirmedAppointment
    );
  }
}

export interface ICancelAppointment {
  execute(id: string): Promise<Appointment>;
}

@injectable()
export class CancelAppointment implements ICancelAppointment {
  constructor(
    @inject('IAppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository
  ) {}

  async execute(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new Error('Rendez-vous non trouvé');
    }

    const cancelledAppointment = appointment.cancel();
    return this.appointmentRepository.updateWithOptimisticLock(
      cancelledAppointment
    );
  }
}

export interface IDeleteAppointment {
  execute(id: string): Promise<void>;
}

@injectable()
export class DeleteAppointment implements IDeleteAppointment {
  constructor(
    @inject('IAppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository
  ) {}

  async execute(id: string): Promise<void> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new Error('Rendez-vous non trouvé');
    }

    await this.appointmentRepository.delete(id);
  }
}

interface GetAppointmentsByDateRangeInput {
  startDate: Date;
  endDate: Date;
}

export interface IGetAppointmentsByDateRange {
  execute(input: GetAppointmentsByDateRangeInput): Promise<Appointment[]>;
}

@injectable()
export class GetAppointmentsByDateRange implements IGetAppointmentsByDateRange {
  constructor(
    @inject('IAppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository
  ) {}

  async execute(
    input: GetAppointmentsByDateRangeInput
  ): Promise<Appointment[]> {
    return this.appointmentRepository.findByDateRange(
      input.startDate,
      input.endDate
    );
  }
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  extendedProps: {
    activityId: string;
    activityName: string;
    clientName: string;
    clientEmail: string;
    status: string;
  };
}

interface GetCalendarEventsInput {
  startDate: Date;
  endDate: Date;
}

export interface IGetCalendarEvents {
  execute(input: GetCalendarEventsInput): Promise<CalendarEvent[]>;
}

@injectable()
export class GetCalendarEvents implements IGetCalendarEvents {
  constructor(
    @inject('IAppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository,
    @inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository
  ) {}

  async execute(input: GetCalendarEventsInput): Promise<CalendarEvent[]> {
    const appointments = await this.appointmentRepository.findByDateRange(
      input.startDate,
      input.endDate
    );

    const activities = await this.activityRepository.findAll();
    const activityColorMap = new Map(
      activities.map((activity) => [activity.id, activity.color])
    );

    return appointments
      .filter((appointment) => appointment.id !== undefined)
      .map((appointment) => ({
        id: appointment.id as string,
        title: `${appointment.activityName} - ${appointment.clientInfo.name}`,
        start: appointment.dateTime,
        end: appointment.endDateTime,
        color:
          activityColorMap.get(appointment.activityId) ||
          CALENDAR_CONSTANTS.DEFAULT_ACTIVITY_COLOR,
        extendedProps: {
          activityId: appointment.activityId,
          activityName: appointment.activityName,
          clientName: appointment.clientInfo.name,
          clientEmail: appointment.clientInfo.email,
          status: appointment.status.value,
        },
      }));
  }
}
