import 'reflect-metadata';
import { Appointment } from '@/domain/appointment/entities/Appointment';
import { AppointmentStatus } from '@/domain/appointment/value-objects/AppointmentStatus';
import { ClientInfo } from '@/domain/appointment/value-objects/ClientInfo';

const mockSession = {
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  abortTransaction: jest.fn(),
  endSession: jest.fn(),
};

// Mock mongoose
jest.mock('mongoose', () => ({
  Types: {
    ObjectId: jest.fn((id: string) => id),
  },
  startSession: jest.fn().mockResolvedValue(mockSession),
}));

// Mock AppointmentModel
const mockAppointmentModel = {
  findById: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  countDocuments: jest.fn().mockReturnValue({
    exec: jest.fn(),
  }),
};

const mockSave = jest.fn();
const MockAppointmentModelConstructor = jest.fn().mockImplementation(() => ({
  save: mockSave,
}));

Object.assign(MockAppointmentModelConstructor, mockAppointmentModel);

jest.mock('@/infrastructure/appointment/models/AppointmentModel', () => ({
  AppointmentModel: MockAppointmentModelConstructor,
}));

import { MongooseAppointmentRepository } from '@/infrastructure/appointment/repositories/MongooseAppointmentRepository';

describe('MongooseAppointmentRepository', () => {
  let repository: MongooseAppointmentRepository;

  const createMockAppointmentDoc = (overrides = {}) => ({
    _id: 'appointment-123',
    activityId: 'activity-1',
    activityName: 'Consultation',
    activityDurationMinutes: 60,
    clientInfo: {
      name: 'Jean Dupont',
      email: 'jean@example.com',
      phone: '0612345678',
      address: '123 Rue de Paris',
      customField: undefined,
    },
    dateTime: new Date('2024-06-15T10:00:00Z'),
    status: 'pending',
    version: 1,
    reminderSent: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  });

  const createAppointment = (overrides = {}) => {
    return Appointment.create({
      id: 'appointment-123',
      activityId: 'activity-1',
      activityName: 'Consultation',
      activityDurationMinutes: 60,
      clientInfo: ClientInfo.create({
        name: 'Jean Dupont',
        email: 'jean@example.com',
        phone: '0612345678',
        address: '123 Rue de Paris',
      }),
      dateTime: new Date('2024-06-15T10:00:00Z'),
      status: AppointmentStatus.pending(),
      version: 1,
      reminderSent: false,
      ...overrides,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new MongooseAppointmentRepository();
  });

  describe('findById', () => {
    it('should return appointment when document exists', async () => {
      const mockDoc = createMockAppointmentDoc();
      mockAppointmentModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDoc),
      });

      const result = await repository.findById('appointment-123');

      expect(mockAppointmentModel.findById).toHaveBeenCalledWith(
        'appointment-123'
      );
      expect(result).toBeInstanceOf(Appointment);
      expect(result?.activityName).toBe('Consultation');
    });

    it('should return null when document does not exist', async () => {
      mockAppointmentModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all appointments sorted by date descending', async () => {
      const mockDocs = [
        createMockAppointmentDoc({
          _id: '1',
          dateTime: new Date('2024-06-20'),
        }),
        createMockAppointmentDoc({
          _id: '2',
          dateTime: new Date('2024-06-15'),
        }),
      ];
      mockAppointmentModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockDocs),
        }),
      });

      const result = await repository.findAll();

      expect(mockAppointmentModel.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });
  });

  describe('findByDateRange', () => {
    it('should return appointments within date range', async () => {
      const startDate = new Date('2024-06-01');
      const endDate = new Date('2024-06-30');
      const mockDocs = [createMockAppointmentDoc()];

      mockAppointmentModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockDocs),
        }),
      });

      const result = await repository.findByDateRange(startDate, endDate);

      expect(mockAppointmentModel.find).toHaveBeenCalledWith({
        dateTime: { $gte: startDate, $lte: endDate },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findByActivityId', () => {
    it('should return appointments for specific activity', async () => {
      const mockDocs = [createMockAppointmentDoc()];
      mockAppointmentModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockDocs),
        }),
      });

      const result = await repository.findByActivityId('activity-1');

      expect(mockAppointmentModel.find).toHaveBeenCalledWith({
        activityId: 'activity-1',
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findPendingReminders', () => {
    it('should return appointments needing reminders', async () => {
      const beforeDate = new Date('2024-06-15T08:00:00Z');
      const mockDocs = [createMockAppointmentDoc()];

      mockAppointmentModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDocs),
      });

      const result = await repository.findPendingReminders(beforeDate);

      expect(mockAppointmentModel.find).toHaveBeenCalledWith({
        reminderSent: false,
        status: { $in: ['pending', 'confirmed'] },
        dateTime: { $lte: beforeDate },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('save', () => {
    it('should save new appointment and return domain entity', async () => {
      const appointment = createAppointment({ id: undefined });
      const savedDoc = createMockAppointmentDoc();

      mockSave.mockResolvedValue(savedDoc);

      const result = await repository.save(appointment);

      expect(MockAppointmentModelConstructor).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Appointment);
      expect(result.id).toBe('appointment-123');
    });
  });

  describe('update', () => {
    it('should update existing appointment', async () => {
      const appointment = createAppointment();
      const updatedDoc = createMockAppointmentDoc({ status: 'confirmed' });

      mockAppointmentModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedDoc),
      });

      const result = await repository.update(appointment);

      expect(mockAppointmentModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'appointment-123',
        expect.any(Object),
        { new: true, runValidators: true }
      );
      expect(result.status.value).toBe('confirmed');
    });

    it('should throw error when appointment has no id', async () => {
      const appointment = createAppointment({ id: undefined });

      await expect(repository.update(appointment)).rejects.toThrow(
        'Le rendez-vous doit avoir un identifiant pour être mis à jour'
      );
    });

    it('should throw error when appointment not found', async () => {
      const appointment = createAppointment();
      mockAppointmentModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(repository.update(appointment)).rejects.toThrow(
        'Rendez-vous non trouvé'
      );
    });
  });

  describe('updateWithOptimisticLock', () => {
    it('should update with version check', async () => {
      const appointment = createAppointment({ version: 2 });
      const updatedDoc = createMockAppointmentDoc({ version: 2 });

      mockAppointmentModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedDoc),
      });

      const result = await repository.updateWithOptimisticLock(appointment);

      expect(mockAppointmentModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'appointment-123', version: 1 },
        expect.any(Object),
        { new: true, runValidators: true }
      );
      expect(result).toBeInstanceOf(Appointment);
    });

    it('should throw error on version conflict', async () => {
      const appointment = createAppointment({ version: 2 });
      mockAppointmentModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        repository.updateWithOptimisticLock(appointment)
      ).rejects.toThrow(
        'Le rendez-vous a été modifié par un autre utilisateur'
      );
    });
  });

  describe('delete', () => {
    it('should delete appointment by id', async () => {
      mockAppointmentModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      });

      await repository.delete('appointment-123');

      expect(mockAppointmentModel.findByIdAndDelete).toHaveBeenCalledWith(
        'appointment-123'
      );
    });
  });

  describe('hasOverlappingAppointment', () => {
    it('should return true when overlapping appointments exist', async () => {
      mockAppointmentModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });

      const result = await repository.hasOverlappingAppointment(
        new Date('2024-06-15T10:00:00Z'),
        60
      );

      expect(result).toBe(true);
    });

    it('should return false when no overlapping appointments', async () => {
      mockAppointmentModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(0),
      });

      const result = await repository.hasOverlappingAppointment(
        new Date('2024-06-15T10:00:00Z'),
        60
      );

      expect(result).toBe(false);
    });

    it('should exclude specified appointment id', async () => {
      mockAppointmentModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(0),
      });

      await repository.hasOverlappingAppointment(
        new Date('2024-06-15T10:00:00Z'),
        60,
        'exclude-id'
      );

      expect(mockAppointmentModel.countDocuments).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: { $ne: 'exclude-id' },
        })
      );
    });
  });

  describe('domain mapping', () => {
    it('should correctly map client info', async () => {
      const mockDoc = createMockAppointmentDoc({
        clientInfo: {
          name: 'Marie Martin',
          email: 'marie@example.com',
          phone: '0698765432',
          address: '456 Avenue de Lyon',
          customField: 'Valeur personnalisée',
        },
      });
      mockAppointmentModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDoc),
      });

      const result = await repository.findById('appointment-123');

      expect(result?.clientInfo.name).toBe('Marie Martin');
      expect(result?.clientInfo.email).toBe('marie@example.com');
    });

    it('should correctly map appointment status', async () => {
      const mockDoc = createMockAppointmentDoc({ status: 'confirmed' });
      mockAppointmentModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDoc),
      });

      const result = await repository.findById('appointment-123');

      expect(result?.status.isConfirmed()).toBe(true);
    });
  });
});
