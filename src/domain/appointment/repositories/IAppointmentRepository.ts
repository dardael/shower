import { Appointment } from '../entities/Appointment';

export interface IAppointmentRepository {
  findById(id: string): Promise<Appointment | null>;
  findAll(): Promise<Appointment[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]>;
  findByActivityId(activityId: string): Promise<Appointment[]>;
  findPendingReminders(beforeDate: Date): Promise<Appointment[]>;
  save(appointment: Appointment): Promise<Appointment>;
  update(appointment: Appointment): Promise<Appointment>;
  updateWithOptimisticLock(appointment: Appointment): Promise<Appointment>;
  delete(id: string): Promise<void>;
  hasOverlappingAppointment(
    dateTime: Date,
    durationMinutes: number,
    excludeId?: string
  ): Promise<boolean>;
}
