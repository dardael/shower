import 'reflect-metadata';
import {
  CreateAppointment,
  GetAllAppointments,
  GetAppointmentById,
  ConfirmAppointment,
  CancelAppointment,
  DeleteAppointment,
  GetAppointmentsByDateRange,
  GetCalendarEvents,
} from '@/application/appointment/AppointmentUseCases';
import type { IAppointmentRepository } from '@/domain/appointment/repositories/IAppointmentRepository';
import type { IActivityRepository } from '@/domain/appointment/repositories/IActivityRepository';
import { Appointment } from '@/domain/appointment/entities/Appointment';
import { Activity } from '@/domain/appointment/entities/Activity';
import { AppointmentStatus } from '@/domain/appointment/value-objects/AppointmentStatus';
import { ClientInfo } from '@/domain/appointment/value-objects/ClientInfo';
import { RequiredFieldsConfig } from '@/domain/appointment/value-objects/RequiredFieldsConfig';
import { ReminderSettings } from '@/domain/appointment/value-objects/ReminderSettings';

describe('AppointmentUseCases', () => {
  let mockAppointmentRepository: jest.Mocked<IAppointmentRepository>;
  let mockActivityRepository: jest.Mocked<IActivityRepository>;

  const createMockActivity = (overrides = {}): Activity => {
    return Activity.create({
      id: 'activity-123',
      name: 'Consultation',
      description: 'Une consultation standard',
      durationMinutes: 60,
      color: '#3182ce',
      price: 50,
      requiredFields: RequiredFieldsConfig.create({
        fields: ['name', 'email', 'phone'],
      }),
      reminderSettings: ReminderSettings.withHours(24),
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
        phone: '0612345678',
      }),
      dateTime: new Date('2025-06-17T10:00:00Z'),
      status: AppointmentStatus.pending(),
      version: 1,
      reminderSent: false,
      ...overrides,
    });
  };

  beforeEach(() => {
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

    mockActivityRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  });

  describe('CreateAppointment', () => {
    let useCase: CreateAppointment;

    beforeEach(() => {
      useCase = new CreateAppointment(
        mockAppointmentRepository,
        mockActivityRepository
      );
    });

    it('should create appointment when activity exists and slot is available', async () => {
      const activity = createMockActivity({ minimumBookingNoticeHours: 0 });
      const savedAppointment = createMockAppointment();

      mockActivityRepository.findById.mockResolvedValue(activity);
      mockAppointmentRepository.hasOverlappingAppointment.mockResolvedValue(
        false
      );
      mockAppointmentRepository.save.mockResolvedValue(savedAppointment);

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const result = await useCase.execute({
        activityId: 'activity-123',
        dateTime: futureDate,
        clientInfo: {
          name: 'Jean Dupont',
          email: 'jean@example.com',
          phone: '0612345678',
        },
      });

      expect(mockActivityRepository.findById).toHaveBeenCalledWith(
        'activity-123'
      );
      expect(mockAppointmentRepository.save).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Appointment);
    });

    it('should throw error when activity not found', async () => {
      mockActivityRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute({
          activityId: 'non-existent',
          dateTime: new Date(),
          clientInfo: { name: 'Test', email: 'test@example.com' },
        })
      ).rejects.toThrow('Activité non trouvée');
    });

    it('should throw error when booking notice is not respected', async () => {
      const activity = createMockActivity({ minimumBookingNoticeHours: 24 });
      mockActivityRepository.findById.mockResolvedValue(activity);

      // Book for 1 hour from now (less than 24 hours)
      const tooSoonDate = new Date();
      tooSoonDate.setHours(tooSoonDate.getHours() + 1);

      await expect(
        useCase.execute({
          activityId: 'activity-123',
          dateTime: tooSoonDate,
          clientInfo: { name: 'Test', email: 'test@example.com' },
        })
      ).rejects.toThrow(
        "La réservation doit être effectuée au moins 24 heures à l'avance"
      );
    });

    it('should throw error when slot has overlapping appointment', async () => {
      const activity = createMockActivity({ minimumBookingNoticeHours: 0 });
      mockActivityRepository.findById.mockResolvedValue(activity);
      mockAppointmentRepository.hasOverlappingAppointment.mockResolvedValue(
        true
      );

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      await expect(
        useCase.execute({
          activityId: 'activity-123',
          dateTime: futureDate,
          clientInfo: { name: 'Test', email: 'test@example.com' },
        })
      ).rejects.toThrow("Ce créneau n'est plus disponible");
    });

    it('should include activity name and duration in appointment', async () => {
      const activity = createMockActivity({
        name: 'Massage',
        durationMinutes: 90,
        minimumBookingNoticeHours: 0,
      });
      mockActivityRepository.findById.mockResolvedValue(activity);
      mockAppointmentRepository.hasOverlappingAppointment.mockResolvedValue(
        false
      );
      mockAppointmentRepository.save.mockImplementation(async (apt) => apt);

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      await useCase.execute({
        activityId: 'activity-123',
        dateTime: futureDate,
        clientInfo: { name: 'Test', email: 'test@example.com' },
      });

      expect(mockAppointmentRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          activityName: 'Massage',
          activityDurationMinutes: 90,
        })
      );
    });
  });

  describe('GetAllAppointments', () => {
    let useCase: GetAllAppointments;

    beforeEach(() => {
      useCase = new GetAllAppointments(mockAppointmentRepository);
    });

    it('should return all appointments', async () => {
      const appointments = [
        createMockAppointment({ id: '1' }),
        createMockAppointment({ id: '2' }),
      ];
      mockAppointmentRepository.findAll.mockResolvedValue(appointments);

      const result = await useCase.execute();

      expect(mockAppointmentRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no appointments', async () => {
      mockAppointmentRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toEqual([]);
    });
  });

  describe('GetAppointmentById', () => {
    let useCase: GetAppointmentById;

    beforeEach(() => {
      useCase = new GetAppointmentById(mockAppointmentRepository);
    });

    it('should return appointment when found', async () => {
      const appointment = createMockAppointment();
      mockAppointmentRepository.findById.mockResolvedValue(appointment);

      const result = await useCase.execute('appointment-123');

      expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(
        'appointment-123'
      );
      expect(result).toBeInstanceOf(Appointment);
    });

    it('should return null when appointment not found', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(null);

      const result = await useCase.execute('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('ConfirmAppointment', () => {
    let useCase: ConfirmAppointment;

    beforeEach(() => {
      useCase = new ConfirmAppointment(mockAppointmentRepository);
    });

    it('should confirm pending appointment', async () => {
      const appointment = createMockAppointment();
      const confirmedAppointment = createMockAppointment({
        status: AppointmentStatus.confirmed(),
      });

      mockAppointmentRepository.findById.mockResolvedValue(appointment);
      mockAppointmentRepository.updateWithOptimisticLock.mockResolvedValue(
        confirmedAppointment
      );

      const result = await useCase.execute('appointment-123');

      expect(result.status.isConfirmed()).toBe(true);
    });

    it('should throw error when appointment not found', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('non-existent')).rejects.toThrow(
        'Rendez-vous non trouvé'
      );
    });
  });

  describe('CancelAppointment', () => {
    let useCase: CancelAppointment;

    beforeEach(() => {
      useCase = new CancelAppointment(mockAppointmentRepository);
    });

    it('should cancel appointment', async () => {
      const appointment = createMockAppointment();
      const cancelledAppointment = createMockAppointment({
        status: AppointmentStatus.cancelled(),
      });

      mockAppointmentRepository.findById.mockResolvedValue(appointment);
      mockAppointmentRepository.updateWithOptimisticLock.mockResolvedValue(
        cancelledAppointment
      );

      const result = await useCase.execute('appointment-123');

      expect(result.status.isCancelled()).toBe(true);
    });

    it('should throw error when appointment not found', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('non-existent')).rejects.toThrow(
        'Rendez-vous non trouvé'
      );
    });
  });

  describe('DeleteAppointment', () => {
    let useCase: DeleteAppointment;

    beforeEach(() => {
      useCase = new DeleteAppointment(mockAppointmentRepository);
    });

    it('should delete existing appointment', async () => {
      const appointment = createMockAppointment();
      mockAppointmentRepository.findById.mockResolvedValue(appointment);
      mockAppointmentRepository.delete.mockResolvedValue(undefined);

      await useCase.execute('appointment-123');

      expect(mockAppointmentRepository.delete).toHaveBeenCalledWith(
        'appointment-123'
      );
    });

    it('should throw error when appointment not found', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('non-existent')).rejects.toThrow(
        'Rendez-vous non trouvé'
      );
    });
  });

  describe('GetAppointmentsByDateRange', () => {
    let useCase: GetAppointmentsByDateRange;

    beforeEach(() => {
      useCase = new GetAppointmentsByDateRange(mockAppointmentRepository);
    });

    it('should return appointments in date range', async () => {
      const appointments = [createMockAppointment()];
      mockAppointmentRepository.findByDateRange.mockResolvedValue(appointments);

      const startDate = new Date('2024-06-01');
      const endDate = new Date('2024-06-30');

      const result = await useCase.execute({ startDate, endDate });

      expect(mockAppointmentRepository.findByDateRange).toHaveBeenCalledWith(
        startDate,
        endDate
      );
      expect(result).toHaveLength(1);
    });
  });

  describe('GetCalendarEvents', () => {
    let useCase: GetCalendarEvents;

    beforeEach(() => {
      useCase = new GetCalendarEvents(
        mockAppointmentRepository,
        mockActivityRepository
      );
    });

    it('should return calendar events with appointment data', async () => {
      const appointment = createMockAppointment();
      const activity = createMockActivity();

      mockAppointmentRepository.findByDateRange.mockResolvedValue([
        appointment,
      ]);
      mockActivityRepository.findAll.mockResolvedValue([activity]);

      const startDate = new Date('2024-06-01');
      const endDate = new Date('2024-06-30');

      const result = await useCase.execute({ startDate, endDate });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'appointment-123',
        title: 'Consultation - Jean Dupont',
        start: appointment.dateTime,
        end: appointment.endDateTime,
        color: '#3182ce',
        extendedProps: {
          activityId: 'activity-123',
          activityName: 'Consultation',
          clientName: 'Jean Dupont',
          clientEmail: 'jean@example.com',
          status: 'pending',
        },
      });
    });

    it('should return empty array when no appointments in range', async () => {
      mockAppointmentRepository.findByDateRange.mockResolvedValue([]);
      mockActivityRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute({
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-30'),
      });

      expect(result).toEqual([]);
    });

    it('should use default color when activity not found', async () => {
      const appointment = createMockAppointment({
        activityId: 'unknown-activity',
      });

      mockAppointmentRepository.findByDateRange.mockResolvedValue([
        appointment,
      ]);
      mockActivityRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute({
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-30'),
      });

      expect(result[0].color).toBe('#3788d8');
    });

    it('should filter out appointments without id', async () => {
      const appointmentWithoutId = createMockAppointment({ id: undefined });

      mockAppointmentRepository.findByDateRange.mockResolvedValue([
        appointmentWithoutId,
      ]);
      mockActivityRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute({
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-30'),
      });

      expect(result).toHaveLength(0);
    });

    it('should include all appointment statuses', async () => {
      const pendingAppointment = createMockAppointment({
        id: '1',
        status: AppointmentStatus.pending(),
      });
      const confirmedAppointment = createMockAppointment({
        id: '2',
        status: AppointmentStatus.confirmed(),
      });
      const cancelledAppointment = createMockAppointment({
        id: '3',
        status: AppointmentStatus.cancelled(),
      });

      mockAppointmentRepository.findByDateRange.mockResolvedValue([
        pendingAppointment,
        confirmedAppointment,
        cancelledAppointment,
      ]);
      mockActivityRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute({
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-30'),
      });

      expect(result).toHaveLength(3);
      expect(result.map((e) => e.extendedProps.status)).toEqual([
        'pending',
        'confirmed',
        'cancelled',
      ]);
    });
  });
});
