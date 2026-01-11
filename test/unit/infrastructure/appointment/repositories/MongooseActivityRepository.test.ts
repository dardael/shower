import 'reflect-metadata';
import { Activity } from '@/domain/appointment/entities/Activity';
import { RequiredFieldsConfig } from '@/domain/appointment/value-objects/RequiredFieldsConfig';
import { ReminderSettings } from '@/domain/appointment/value-objects/ReminderSettings';

// Mock ActivityModel
const mockActivityModel = {
  findById: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

const mockSave = jest.fn();
const MockActivityModelConstructor = jest.fn().mockImplementation(() => ({
  save: mockSave,
}));

Object.assign(MockActivityModelConstructor, mockActivityModel);

jest.mock('@/infrastructure/appointment/models/ActivityModel', () => ({
  ActivityModel: MockActivityModelConstructor,
}));

import { MongooseActivityRepository } from '@/infrastructure/appointment/repositories/MongooseActivityRepository';

describe('MongooseActivityRepository', () => {
  let repository: MongooseActivityRepository;

  const createMockActivityDoc = (overrides = {}) => ({
    _id: 'activity-123',
    name: 'Consultation',
    description: 'Une consultation standard',
    durationMinutes: 60,
    color: '#3182ce',
    price: 50,
    requiredFields: {
      fields: ['name', 'email', 'phone'],
      customFieldLabel: undefined,
    },
    reminderSettings: {
      enabled: true,
      hoursBefore: 24,
    },
    minimumBookingNoticeHours: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  });

  const createActivity = (overrides = {}) => {
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
    jest.clearAllMocks();
    repository = new MongooseActivityRepository();
  });

  describe('findById', () => {
    it('should return activity when document exists', async () => {
      const mockDoc = createMockActivityDoc();
      mockActivityModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDoc),
      });

      const result = await repository.findById('activity-123');

      expect(mockActivityModel.findById).toHaveBeenCalledWith('activity-123');
      expect(result).toBeInstanceOf(Activity);
      expect(result?.name).toBe('Consultation');
      expect(result?.durationMinutes).toBe(60);
    });

    it('should return null when document does not exist', async () => {
      mockActivityModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all activities sorted by name', async () => {
      const mockDocs = [
        createMockActivityDoc({ _id: '1', name: 'Activité A' }),
        createMockActivityDoc({ _id: '2', name: 'Activité B' }),
      ];
      mockActivityModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockDocs),
        }),
      });

      const result = await repository.findAll();

      expect(mockActivityModel.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Activité A');
      expect(result[1].name).toBe('Activité B');
    });

    it('should return empty array when no activities exist', async () => {
      mockActivityModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      });

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('save', () => {
    it('should save new activity and return domain entity', async () => {
      const activity = createActivity({ id: undefined });
      const savedDoc = createMockActivityDoc();

      mockSave.mockResolvedValue(savedDoc);

      const result = await repository.save(activity);

      expect(MockActivityModelConstructor).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Activity);
      expect(result.id).toBe('activity-123');
    });
  });

  describe('update', () => {
    it('should update existing activity', async () => {
      const activity = createActivity();
      const updatedDoc = createMockActivityDoc({
        name: 'Consultation mise à jour',
      });

      mockActivityModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedDoc),
      });

      const result = await repository.update(activity);

      expect(mockActivityModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'activity-123',
        expect.any(Object),
        { new: true, runValidators: true }
      );
      expect(result.name).toBe('Consultation mise à jour');
    });

    it('should throw error when activity has no id', async () => {
      const activity = createActivity({ id: undefined });

      await expect(repository.update(activity)).rejects.toThrow(
        "L'activité doit avoir un identifiant pour être mise à jour"
      );
    });

    it('should throw error when activity not found', async () => {
      const activity = createActivity();
      mockActivityModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(repository.update(activity)).rejects.toThrow(
        'Activité non trouvée'
      );
    });
  });

  describe('delete', () => {
    it('should delete activity by id', async () => {
      mockActivityModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      });

      await repository.delete('activity-123');

      expect(mockActivityModel.findByIdAndDelete).toHaveBeenCalledWith(
        'activity-123'
      );
    });
  });

  describe('domain mapping', () => {
    it('should correctly map reminder settings disabled', async () => {
      const mockDoc = createMockActivityDoc({
        reminderSettings: { enabled: false, hoursBefore: 0 },
      });
      mockActivityModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDoc),
      });

      const result = await repository.findById('activity-123');

      expect(result?.reminderSettings.enabled).toBe(false);
    });

    it('should correctly map custom field label', async () => {
      const mockDoc = createMockActivityDoc({
        requiredFields: {
          fields: ['name', 'email', 'custom'],
          customFieldLabel: 'Numéro de commande',
        },
      });
      mockActivityModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDoc),
      });

      const result = await repository.findById('activity-123');

      expect(result?.requiredFields.isFieldRequired('custom')).toBe(true);
      expect(result?.requiredFields.customFieldLabel).toBe(
        'Numéro de commande'
      );
    });
  });
});
