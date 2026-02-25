import 'reflect-metadata';
import {
  GetAvailability,
  UpdateAvailability,
  GetAvailableSlots,
  GetAvailableDaysInWeek,
} from '@/application/appointment/AvailabilityUseCases';
import type { IAvailabilityRepository } from '@/domain/appointment/repositories/IAvailabilityRepository';
import type { IActivityRepository } from '@/domain/appointment/repositories/IActivityRepository';
import type { IAppointmentRepository } from '@/domain/appointment/repositories/IAppointmentRepository';
import { Availability } from '@/domain/appointment/entities/Availability';
import { Activity } from '@/domain/appointment/entities/Activity';
import { Appointment } from '@/domain/appointment/entities/Appointment';
import { WeeklySlot } from '@/domain/appointment/value-objects/WeeklySlot';
import { AvailabilityException } from '@/domain/appointment/value-objects/AvailabilityException';
import { RequiredFieldsConfig } from '@/domain/appointment/value-objects/RequiredFieldsConfig';
import { ReminderSettings } from '@/domain/appointment/value-objects/ReminderSettings';
import { AppointmentStatus } from '@/domain/appointment/value-objects/AppointmentStatus';
import { ClientInfo } from '@/domain/appointment/value-objects/ClientInfo';

describe('AvailabilityUseCases', () => {
  let mockAvailabilityRepository: jest.Mocked<IAvailabilityRepository>;
  let mockActivityRepository: jest.Mocked<IActivityRepository>;
  let mockAppointmentRepository: jest.Mocked<IAppointmentRepository>;

  const createMockAvailability = (overrides = {}): Availability => {
    return Availability.create({
      id: 'availability-123',
      weeklySlots: [
        WeeklySlot.create({
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '12:00',
        }),
        WeeklySlot.create({
          dayOfWeek: 1,
          startTime: '14:00',
          endTime: '18:00',
        }),
      ],
      exceptions: [
        AvailabilityException.create({
          startDate: new Date('2024-12-25'),
          endDate: new Date('2024-12-25'),
          reason: 'Noël',
        }),
      ],
      ...overrides,
    });
  };

  const createMockActivity = (overrides = {}): Activity => {
    return Activity.create({
      id: 'activity-123',
      name: 'Consultation',
      description: 'Une consultation standard',
      durationMinutes: 60,
      color: '#3182ce',
      price: 50,
      requiredFields: RequiredFieldsConfig.create({
        fields: ['name', 'email'],
      }),
      reminderSettings: ReminderSettings.disabled(),
      minimumBookingNoticeHours: 2,
      ...overrides,
    });
  };

  const createMockAppointment = (overrides = {}): Appointment => {
    return Appointment.create({
      id: 'appointment-123',
      activityId: 'activity-123',
      activityName: 'Consultation',
      activityDurationMinutes: 60,
      clientInfo: ClientInfo.create({
        name: 'Jean Dupont',
        email: 'jean@example.com',
      }),
      dateTime: new Date('2024-06-15T10:00:00Z'),
      status: AppointmentStatus.confirmed(),
      version: 1,
      reminderSent: false,
      ...overrides,
    });
  };

  beforeEach(() => {
    mockAvailabilityRepository = {
      find: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };
    mockActivityRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    mockAppointmentRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      findByDateRange: jest.fn(),
      findByActivityId: jest.fn(),
      findPendingReminders: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      updateWithOptimisticLock: jest.fn(),
      delete: jest.fn(),
      hasOverlappingAppointment: jest.fn(),
    };
  });

  describe('GetAvailability', () => {
    let useCase: GetAvailability;

    beforeEach(() => {
      useCase = new GetAvailability(mockAvailabilityRepository);
    });

    it('should return availability when it exists', async () => {
      const availability = createMockAvailability();
      mockAvailabilityRepository.find.mockResolvedValue(availability);

      const result = await useCase.execute();

      expect(mockAvailabilityRepository.find).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Availability);
      expect(result.weeklySlots).toHaveLength(2);
    });

    it('should return empty availability when none exists', async () => {
      mockAvailabilityRepository.find.mockResolvedValue(null);

      const result = await useCase.execute();

      expect(result).toBeInstanceOf(Availability);
      expect(result.weeklySlots).toHaveLength(0);
      expect(result.exceptions).toHaveLength(0);
    });
  });

  describe('UpdateAvailability', () => {
    let useCase: UpdateAvailability;

    beforeEach(() => {
      useCase = new UpdateAvailability(mockAvailabilityRepository);
    });

    it('should update existing availability', async () => {
      const existingAvailability = createMockAvailability();
      const updatedAvailability = createMockAvailability();

      mockAvailabilityRepository.find.mockResolvedValue(existingAvailability);
      mockAvailabilityRepository.update.mockResolvedValue(updatedAvailability);

      const result = await useCase.execute({
        weeklySlots: [{ dayOfWeek: 2, startTime: '10:00', endTime: '16:00' }],
        exceptions: [],
      });

      expect(mockAvailabilityRepository.find).toHaveBeenCalled();
      expect(mockAvailabilityRepository.update).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Availability);
    });

    it('should create new availability when none exists', async () => {
      const newAvailability = createMockAvailability();

      mockAvailabilityRepository.find.mockResolvedValue(null);
      mockAvailabilityRepository.save.mockResolvedValue(newAvailability);

      const result = await useCase.execute({
        weeklySlots: [{ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }],
        exceptions: [
          { startDate: '2024-12-25', endDate: '2024-12-25', reason: 'Noël' },
        ],
      });

      expect(mockAvailabilityRepository.save).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Availability);
    });

    it('should handle empty weekly slots', async () => {
      const newAvailability = createMockAvailability();

      mockAvailabilityRepository.find.mockResolvedValue(null);
      mockAvailabilityRepository.save.mockResolvedValue(newAvailability);

      await useCase.execute({
        weeklySlots: [],
        exceptions: [],
      });

      expect(mockAvailabilityRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          weeklySlots: [],
        })
      );
    });
  });

  describe('GetAvailableSlots', () => {
    let useCase: GetAvailableSlots;

    beforeEach(() => {
      useCase = new GetAvailableSlots(
        mockAvailabilityRepository,
        mockActivityRepository,
        mockAppointmentRepository
      );
    });

    it('should throw error when activity not found', async () => {
      mockActivityRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute({
          activityId: 'non-existent',
          date: new Date('2024-06-15'),
        })
      ).rejects.toThrow('Activité non trouvée');
    });

    it('should return empty array when no availability exists', async () => {
      const activity = createMockActivity();
      mockActivityRepository.findById.mockResolvedValue(activity);
      mockAvailabilityRepository.find.mockResolvedValue(null);

      const result = await useCase.execute({
        activityId: 'activity-123',
        date: new Date('2024-06-15'),
      });

      expect(result).toEqual([]);
    });

    it('should return empty array when date is excluded', async () => {
      const activity = createMockActivity();
      const availability = createMockAvailability({
        exceptions: [
          AvailabilityException.create({
            startDate: new Date('2024-06-15'),
            endDate: new Date('2024-06-15'),
            reason: 'Fermé',
          }),
        ],
      });

      mockActivityRepository.findById.mockResolvedValue(activity);
      mockAvailabilityRepository.find.mockResolvedValue(availability);

      const result = await useCase.execute({
        activityId: 'activity-123',
        date: new Date('2024-06-15'),
      });

      expect(result).toEqual([]);
    });

    it('should return empty array when no slots for day of week', async () => {
      const activity = createMockActivity();
      const availability = createMockAvailability({
        weeklySlots: [
          WeeklySlot.create({
            dayOfWeek: 1,
            startTime: '09:00',
            endTime: '17:00',
          }),
        ],
      });

      mockActivityRepository.findById.mockResolvedValue(activity);
      mockAvailabilityRepository.find.mockResolvedValue(availability);
      mockAppointmentRepository.findByDateRange.mockResolvedValue([]);

      // Saturday (dayOfWeek = 6) - no slots defined for Saturday
      const result = await useCase.execute({
        activityId: 'activity-123',
        date: new Date('2024-06-15'), // This is a Saturday
      });

      expect(result).toEqual([]);
    });

    it('should generate available slots for the day', async () => {
      const activity = createMockActivity({
        durationMinutes: 60,
        minimumBookingNoticeHours: 0,
      });
      // Use a future Monday
      const futureMonday = new Date();
      futureMonday.setDate(
        futureMonday.getDate() + ((8 - futureMonday.getDay()) % 7 || 7)
      );
      futureMonday.setHours(0, 0, 0, 0);

      const availability = createMockAvailability({
        weeklySlots: [
          WeeklySlot.create({
            dayOfWeek: 1,
            startTime: '09:00',
            endTime: '11:00',
          }),
        ],
        exceptions: [],
      });

      mockActivityRepository.findById.mockResolvedValue(activity);
      mockAvailabilityRepository.find.mockResolvedValue(availability);
      mockAppointmentRepository.findByDateRange.mockResolvedValue([]);

      const result = await useCase.execute({
        activityId: 'activity-123',
        date: futureMonday,
      });

      // 09:00-11:00 with 60min duration: 09:00, 10:00
      expect(result.length).toBe(2);
      const startTimes = result.map((slot: { startTime: Date }) =>
        slot.startTime.getHours()
      );
      expect(startTimes).toEqual([9, 10]);
    });

    it('should exclude slots with existing appointments', async () => {
      const activity = createMockActivity({
        durationMinutes: 60,
        minimumBookingNoticeHours: 0,
      });
      // Use a future Monday
      const futureMonday = new Date();
      futureMonday.setDate(
        futureMonday.getDate() + ((8 - futureMonday.getDay()) % 7 || 7)
      );
      futureMonday.setHours(0, 0, 0, 0);

      const availability = createMockAvailability({
        weeklySlots: [
          WeeklySlot.create({
            dayOfWeek: 1,
            startTime: '09:00',
            endTime: '12:00',
          }),
        ],
        exceptions: [],
      });

      const appointmentDateTime = new Date(futureMonday);
      appointmentDateTime.setHours(9, 0, 0, 0);

      const existingAppointment = createMockAppointment({
        dateTime: appointmentDateTime,
        activityDurationMinutes: 60,
        status: AppointmentStatus.confirmed(),
      });

      mockActivityRepository.findById.mockResolvedValue(activity);
      mockAvailabilityRepository.find.mockResolvedValue(availability);
      mockAppointmentRepository.findByDateRange.mockResolvedValue([
        existingAppointment,
      ]);

      const result = await useCase.execute({
        activityId: 'activity-123',
        date: futureMonday,
      });

      // The 09:00 slot should be excluded due to existing appointment
      const has9amSlot = result.some(
        (slot: { startTime: Date }) =>
          slot.startTime.getHours() === 9 && slot.startTime.getMinutes() === 0
      );
      expect(has9amSlot).toBe(false);
    });

    it('should not exclude cancelled appointments', async () => {
      const activity = createMockActivity({
        durationMinutes: 60,
        minimumBookingNoticeHours: 0,
      });
      // Use a future Monday
      const futureMonday = new Date();
      futureMonday.setDate(
        futureMonday.getDate() + ((8 - futureMonday.getDay()) % 7 || 7)
      );
      futureMonday.setHours(0, 0, 0, 0);

      const availability = createMockAvailability({
        weeklySlots: [
          WeeklySlot.create({
            dayOfWeek: 1,
            startTime: '09:00',
            endTime: '11:00',
          }),
        ],
        exceptions: [],
      });

      const appointmentDateTime = new Date(futureMonday);
      appointmentDateTime.setHours(9, 0, 0, 0);

      const cancelledAppointment = createMockAppointment({
        dateTime: appointmentDateTime,
        activityDurationMinutes: 60,
        status: AppointmentStatus.cancelled(),
      });

      mockActivityRepository.findById.mockResolvedValue(activity);
      mockAvailabilityRepository.find.mockResolvedValue(availability);
      mockAppointmentRepository.findByDateRange.mockResolvedValue([
        cancelledAppointment,
      ]);

      const result = await useCase.execute({
        activityId: 'activity-123',
        date: futureMonday,
      });

      // The slot should still be available since the appointment is cancelled
      expect(result.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GetAvailableDaysInWeek', () => {
    let useCase: GetAvailableDaysInWeek;

    // Monday 2024-06-10 (week with monday available at 09:00-12:00)
    const mondayWeekStart = new Date('2024-06-10T00:00:00.000Z');

    beforeEach(() => {
      useCase = new GetAvailableDaysInWeek(
        mockAvailabilityRepository,
        mockActivityRepository,
        mockAppointmentRepository
      );
    });

    it("devrait retourner une erreur si l'activité n'est pas trouvée", async () => {
      mockActivityRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute({ activityId: 'unknown', weekStart: mondayWeekStart })
      ).rejects.toThrow('Activité non trouvée');
    });

    it('devrait retourner un tableau vide si aucune disponibilité', async () => {
      mockActivityRepository.findById.mockResolvedValue(createMockActivity());
      mockAvailabilityRepository.find.mockResolvedValue(null);

      const result = await useCase.execute({
        activityId: 'activity-123',
        weekStart: mondayWeekStart,
      });

      expect(result).toEqual([]);
    });

    it('devrait retourner un tableau vide si aucun jour de la semaine a de créneaux configurés', async () => {
      mockActivityRepository.findById.mockResolvedValue(createMockActivity());
      const availability = Availability.create({
        id: 'availability-123',
        weeklySlots: [],
        exceptions: [],
      });
      mockAvailabilityRepository.find.mockResolvedValue(availability);
      mockAppointmentRepository.findByDateRange.mockResolvedValue([]);

      const result = await useCase.execute({
        activityId: 'activity-123',
        weekStart: mondayWeekStart,
      });

      expect(result).toEqual([]);
    });

    it('devrait retourner les jours qui ont au moins un créneau disponible', async () => {
      mockActivityRepository.findById.mockResolvedValue(createMockActivity());
      const availability = createMockAvailability(); // lundi 09:00-12:00 et 14:00-18:00
      mockAvailabilityRepository.find.mockResolvedValue(availability);
      mockAppointmentRepository.findByDateRange.mockResolvedValue([]);

      const result = await useCase.execute({
        activityId: 'activity-123',
        weekStart: mondayWeekStart,
      });

      // La semaine contient le lundi 2024-06-10 qui a des créneaux configurés
      expect(result).toContain('2024-06-10');
      // Les autres jours (mardi-dimanche) n'ont pas de créneaux configurés
      expect(result).not.toContain('2024-06-11');
    });

    it('devrait exclure les jours marqués comme exceptions', async () => {
      mockActivityRepository.findById.mockResolvedValue(createMockActivity());
      const availability = Availability.create({
        id: 'availability-123',
        weeklySlots: [
          WeeklySlot.create({
            dayOfWeek: 1,
            startTime: '09:00',
            endTime: '12:00',
          }),
        ],
        exceptions: [
          AvailabilityException.create({
            startDate: new Date('2024-06-10T00:00:00.000Z'),
            endDate: new Date('2024-06-10T00:00:00.000Z'),
            reason: 'Férié',
          }),
        ],
      });
      mockAvailabilityRepository.find.mockResolvedValue(availability);
      mockAppointmentRepository.findByDateRange.mockResolvedValue([]);

      const result = await useCase.execute({
        activityId: 'activity-123',
        weekStart: mondayWeekStart,
      });

      expect(result).not.toContain('2024-06-10');
    });

    it('devrait exclure un jour dont tous les créneaux sont occupés par des rendez-vous', async () => {
      mockActivityRepository.findById.mockResolvedValue(
        createMockActivity({
          durationMinutes: 60,
          minimumBookingNoticeHours: 0,
        })
      );
      const availability = Availability.create({
        id: 'availability-123',
        weeklySlots: [
          WeeklySlot.create({
            dayOfWeek: 1,
            startTime: '09:00',
            endTime: '10:00',
          }),
        ],
        exceptions: [],
      });
      mockAvailabilityRepository.find.mockResolvedValue(availability);

      // Le seul créneau possible (09:00-10:00) est occupé
      const appointment = createMockAppointment({
        dateTime: new Date('2024-06-10T09:00:00.000Z'),
        status: AppointmentStatus.confirmed(),
      });
      mockAppointmentRepository.findByDateRange.mockResolvedValue([
        appointment,
      ]);

      const result = await useCase.execute({
        activityId: 'activity-123',
        weekStart: mondayWeekStart,
      });

      expect(result).not.toContain('2024-06-10');
    });

    it('devrait inclure un jour dont les rendez-vous annulés libèrent les créneaux', async () => {
      mockActivityRepository.findById.mockResolvedValue(
        createMockActivity({
          durationMinutes: 60,
          minimumBookingNoticeHours: 0,
        })
      );
      const availability = Availability.create({
        id: 'availability-123',
        weeklySlots: [
          WeeklySlot.create({
            dayOfWeek: 1,
            startTime: '09:00',
            endTime: '10:00',
          }),
        ],
        exceptions: [],
      });
      mockAvailabilityRepository.find.mockResolvedValue(availability);

      const cancelledAppointment = createMockAppointment({
        dateTime: new Date('2024-06-10T09:00:00.000Z'),
        status: AppointmentStatus.cancelled(),
      });
      mockAppointmentRepository.findByDateRange.mockResolvedValue([
        cancelledAppointment,
      ]);

      const result = await useCase.execute({
        activityId: 'activity-123',
        weekStart: mondayWeekStart,
      });

      expect(result).toContain('2024-06-10');
    });
  });
});
