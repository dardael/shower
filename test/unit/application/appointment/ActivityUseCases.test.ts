import 'reflect-metadata';
import {
  CreateActivity,
  GetAllActivities,
  GetActivityById,
  UpdateActivity,
  DeleteActivity,
} from '@/application/appointment/ActivityUseCases';
import type { IActivityRepository } from '@/domain/appointment/repositories/IActivityRepository';
import { Activity } from '@/domain/appointment/entities/Activity';
import { RequiredFieldsConfig } from '@/domain/appointment/value-objects/RequiredFieldsConfig';
import { ReminderSettings } from '@/domain/appointment/value-objects/ReminderSettings';

describe('ActivityUseCases', () => {
  let mockRepository: jest.Mocked<IActivityRepository>;

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

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  });

  describe('CreateActivity', () => {
    let useCase: CreateActivity;

    beforeEach(() => {
      useCase = new CreateActivity(mockRepository);
    });

    it('should create activity with all fields', async () => {
      const savedActivity = createMockActivity();
      mockRepository.save.mockResolvedValue(savedActivity);

      const result = await useCase.execute({
        name: 'Consultation',
        description: 'Une consultation standard',
        durationMinutes: 60,
        color: '#3182ce',
        price: 50,
        requiredFields: {
          fields: ['name', 'email', 'phone'],
        },
        reminderSettings: {
          enabled: true,
          hoursBefore: 24,
        },
        minimumBookingNoticeHours: 2,
      });

      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Activity);
      expect(result.name).toBe('Consultation');
    });

    it('should create activity with disabled reminders', async () => {
      const savedActivity = createMockActivity();
      mockRepository.save.mockResolvedValue(savedActivity);

      await useCase.execute({
        name: 'Consultation',
        durationMinutes: 30,
        color: '#3182ce',
        price: 25,
        requiredFields: { fields: ['name', 'email'] },
        reminderSettings: { enabled: false },
        minimumBookingNoticeHours: 1,
      });

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          reminderSettings: expect.objectContaining({ enabled: false }),
        })
      );
    });

    it('should create activity with custom field', async () => {
      const savedActivity = createMockActivity();
      mockRepository.save.mockResolvedValue(savedActivity);

      await useCase.execute({
        name: 'Consultation',
        durationMinutes: 60,
        color: '#3182ce',
        price: 50,
        requiredFields: {
          fields: ['name', 'email', 'custom'],
          customFieldLabel: 'Numéro de dossier',
        },
        reminderSettings: { enabled: true, hoursBefore: 48 },
        minimumBookingNoticeHours: 2,
      });

      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should use default 24 hours for reminder when not specified', async () => {
      const savedActivity = createMockActivity();
      mockRepository.save.mockResolvedValue(savedActivity);

      await useCase.execute({
        name: 'Consultation',
        durationMinutes: 60,
        color: '#3182ce',
        price: 50,
        requiredFields: { fields: ['name', 'email'] },
        reminderSettings: { enabled: true },
        minimumBookingNoticeHours: 2,
      });

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          reminderSettings: expect.objectContaining({ hoursBefore: 24 }),
        })
      );
    });
  });

  describe('GetAllActivities', () => {
    let useCase: GetAllActivities;

    beforeEach(() => {
      useCase = new GetAllActivities(mockRepository);
    });

    it('should return all activities from repository', async () => {
      const activities = [
        createMockActivity({ id: '1', name: 'Activité A' }),
        createMockActivity({ id: '2', name: 'Activité B' }),
      ];
      mockRepository.findAll.mockResolvedValue(activities);

      const result = await useCase.execute();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Activité A');
    });

    it('should return empty array when no activities exist', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toEqual([]);
    });
  });

  describe('GetActivityById', () => {
    let useCase: GetActivityById;

    beforeEach(() => {
      useCase = new GetActivityById(mockRepository);
    });

    it('should return activity when found', async () => {
      const activity = createMockActivity();
      mockRepository.findById.mockResolvedValue(activity);

      const result = await useCase.execute('activity-123');

      expect(mockRepository.findById).toHaveBeenCalledWith('activity-123');
      expect(result).toBeInstanceOf(Activity);
      expect(result?.name).toBe('Consultation');
    });

    it('should return null when activity not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await useCase.execute('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('UpdateActivity', () => {
    let useCase: UpdateActivity;

    beforeEach(() => {
      useCase = new UpdateActivity(mockRepository);
    });

    it('should update existing activity', async () => {
      const existingActivity = createMockActivity();
      const updatedActivity = createMockActivity({
        name: 'Consultation mise à jour',
      });

      mockRepository.findById.mockResolvedValue(existingActivity);
      mockRepository.update.mockResolvedValue(updatedActivity);

      const result = await useCase.execute({
        id: 'activity-123',
        name: 'Consultation mise à jour',
      });

      expect(mockRepository.findById).toHaveBeenCalledWith('activity-123');
      expect(mockRepository.update).toHaveBeenCalled();
      expect(result.name).toBe('Consultation mise à jour');
    });

    it('should throw error when activity not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute({ id: 'non-existent', name: 'Test' })
      ).rejects.toThrow('Activité non trouvée');
    });

    it('should update only specified fields', async () => {
      const existingActivity = createMockActivity();
      mockRepository.findById.mockResolvedValue(existingActivity);
      mockRepository.update.mockResolvedValue(existingActivity);

      await useCase.execute({
        id: 'activity-123',
        price: 75,
      });

      expect(mockRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          price: 75,
          name: 'Consultation',
        })
      );
    });

    it('should update reminder settings', async () => {
      const existingActivity = createMockActivity();
      mockRepository.findById.mockResolvedValue(existingActivity);
      mockRepository.update.mockResolvedValue(existingActivity);

      await useCase.execute({
        id: 'activity-123',
        reminderSettings: { enabled: false },
      });

      expect(mockRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          reminderSettings: expect.objectContaining({ enabled: false }),
        })
      );
    });
  });

  describe('DeleteActivity', () => {
    let useCase: DeleteActivity;

    beforeEach(() => {
      useCase = new DeleteActivity(mockRepository);
    });

    it('should delete existing activity', async () => {
      const existingActivity = createMockActivity();
      mockRepository.findById.mockResolvedValue(existingActivity);
      mockRepository.delete.mockResolvedValue(undefined);

      await useCase.execute('activity-123');

      expect(mockRepository.findById).toHaveBeenCalledWith('activity-123');
      expect(mockRepository.delete).toHaveBeenCalledWith('activity-123');
    });

    it('should throw error when activity not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('non-existent')).rejects.toThrow(
        'Activité non trouvée'
      );
    });

    it('should not call delete if activity not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      try {
        await useCase.execute('non-existent');
      } catch {
        // Expected error
      }

      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });
});
