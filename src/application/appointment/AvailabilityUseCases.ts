import { inject, injectable } from 'tsyringe';
import type { IAvailabilityRepository } from '@/domain/appointment/repositories/IAvailabilityRepository';
import type { IActivityRepository } from '@/domain/appointment/repositories/IActivityRepository';
import type { IAppointmentRepository } from '@/domain/appointment/repositories/IAppointmentRepository';
import { Availability } from '@/domain/appointment/entities/Availability';
import { WeeklySlot } from '@/domain/appointment/value-objects/WeeklySlot';
import { AvailabilityException } from '@/domain/appointment/value-objects/AvailabilityException';
import { TIME_CONSTANTS, minutesToMs, hoursToMs } from './constants';

export interface IGetAvailability {
  execute(): Promise<Availability>;
}

@injectable()
export class GetAvailability implements IGetAvailability {
  constructor(
    @inject('IAvailabilityRepository')
    private readonly availabilityRepository: IAvailabilityRepository
  ) {}

  async execute(): Promise<Availability> {
    const availability = await this.availabilityRepository.find();
    return availability || Availability.empty();
  }
}

interface UpdateAvailabilityInput {
  weeklySlots: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>;
  exceptions: Array<{
    date: string;
    reason?: string;
  }>;
}

export interface IUpdateAvailability {
  execute(input: UpdateAvailabilityInput): Promise<Availability>;
}

@injectable()
export class UpdateAvailability implements IUpdateAvailability {
  constructor(
    @inject('IAvailabilityRepository')
    private readonly availabilityRepository: IAvailabilityRepository
  ) {}

  async execute(input: UpdateAvailabilityInput): Promise<Availability> {
    const weeklySlots = input.weeklySlots.map((slot) =>
      WeeklySlot.create({
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
      })
    );

    const exceptions = input.exceptions.map((exc) =>
      AvailabilityException.create({
        date: new Date(exc.date),
        reason: exc.reason,
      })
    );

    const existingAvailability = await this.availabilityRepository.find();

    if (existingAvailability) {
      const updatedAvailability = existingAvailability.update({
        weeklySlots,
        exceptions,
      });
      return this.availabilityRepository.update(updatedAvailability);
    } else {
      const newAvailability = Availability.create({
        weeklySlots,
        exceptions,
      });
      return this.availabilityRepository.save(newAvailability);
    }
  }
}

interface TimeSlot {
  startTime: Date;
  endTime: Date;
}

interface GetAvailableSlotsInput {
  activityId: string;
  date: Date;
}

export interface IGetAvailableSlots {
  execute(input: GetAvailableSlotsInput): Promise<TimeSlot[]>;
}

@injectable()
export class GetAvailableSlots implements IGetAvailableSlots {
  constructor(
    @inject('IAvailabilityRepository')
    private readonly availabilityRepository: IAvailabilityRepository,
    @inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository,
    @inject('IAppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository
  ) {}

  async execute(input: GetAvailableSlotsInput): Promise<TimeSlot[]> {
    const activity = await this.activityRepository.findById(input.activityId);
    if (!activity) {
      throw new Error('Activité non trouvée');
    }

    const availability = await this.availabilityRepository.find();
    if (!availability) {
      return [];
    }

    if (availability.isDateExcluded(input.date)) {
      return [];
    }

    const dayOfWeek = input.date.getDay();
    const daySlots = availability.getSlotsForDay(dayOfWeek);

    if (daySlots.length === 0) {
      return [];
    }

    const startOfDay = new Date(input.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(input.date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments =
      await this.appointmentRepository.findByDateRange(startOfDay, endOfDay);

    const activeAppointments = existingAppointments.filter(
      (apt) => !apt.status.isCancelled()
    );

    const availableSlots: TimeSlot[] = [];
    const durationMinutes = activity.durationMinutes;

    for (const slot of daySlots) {
      const [startHour, startMinute] = slot.startTime.split(':').map(Number);
      const [endHour, endMinute] = slot.endTime.split(':').map(Number);

      const slotStart = new Date(input.date);
      slotStart.setHours(startHour, startMinute, 0, 0);

      const slotEnd = new Date(input.date);
      slotEnd.setHours(endHour, endMinute, 0, 0);

      let currentStart = new Date(slotStart);

      while (
        currentStart.getTime() + durationMinutes * 60 * 1000 <=
        slotEnd.getTime()
      ) {
        const currentEnd = new Date(
          currentStart.getTime() + durationMinutes * 60 * 1000
        );

        const hasConflict = activeAppointments.some((apt) => {
          const aptEnd = apt.endDateTime;
          return currentStart < aptEnd && apt.dateTime < currentEnd;
        });

        const now = new Date();
        const minNoticeMs = hoursToMs(activity.minimumBookingNoticeHours);
        const isWithinNotice =
          currentStart.getTime() - now.getTime() < minNoticeMs;

        if (!hasConflict && !isWithinNotice) {
          availableSlots.push({
            startTime: new Date(currentStart),
            endTime: currentEnd,
          });
        }

        currentStart = new Date(
          currentStart.getTime() +
            minutesToMs(TIME_CONSTANTS.SLOT_GENERATION_INTERVAL_MINUTES)
        );
      }
    }

    return availableSlots;
  }
}
