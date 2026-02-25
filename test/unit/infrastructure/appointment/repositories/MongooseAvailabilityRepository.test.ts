import 'reflect-metadata';
import { Availability } from '@/domain/appointment/entities/Availability';
import { WeeklySlot } from '@/domain/appointment/value-objects/WeeklySlot';
import { AvailabilityException } from '@/domain/appointment/value-objects/AvailabilityException';

// Mock AvailabilityModel
const mockAvailabilityModel = {
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn().mockReturnValue({
    exec: jest.fn(),
  }),
  findOneAndUpdate: jest.fn().mockReturnValue({
    exec: jest.fn(),
  }),
};

const mockSave = jest.fn();
const MockAvailabilityModelConstructor = jest.fn().mockImplementation(() => ({
  save: mockSave,
}));

Object.assign(MockAvailabilityModelConstructor, mockAvailabilityModel);

jest.mock('@/infrastructure/appointment/models/AvailabilityModel', () => ({
  AvailabilityModel: MockAvailabilityModelConstructor,
}));

import { MongooseAvailabilityRepository } from '@/infrastructure/appointment/repositories/MongooseAvailabilityRepository';

describe('MongooseAvailabilityRepository', () => {
  let repository: MongooseAvailabilityRepository;

  const createMockAvailabilityDoc = (overrides = {}) => ({
    _id: 'availability-123',
    weeklySlots: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '12:00' },
      { dayOfWeek: 1, startTime: '14:00', endTime: '18:00' },
    ],
    exceptions: [
      {
        startDate: new Date('2024-12-25'),
        endDate: new Date('2024-12-25'),
        reason: 'Noël',
      },
    ],
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  });

  const createAvailability = (overrides = {}) => {
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

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new MongooseAvailabilityRepository();
  });

  describe('find', () => {
    it('should return availability when document exists', async () => {
      const mockDoc = createMockAvailabilityDoc();
      mockAvailabilityModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDoc),
      });

      const result = await repository.find();

      expect(mockAvailabilityModel.findOne).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Availability);
      expect(result?.weeklySlots).toHaveLength(2);
      expect(result?.exceptions).toHaveLength(1);
    });

    it('should return null when no document exists', async () => {
      mockAvailabilityModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await repository.find();

      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should save new availability and return domain entity', async () => {
      const availability = createAvailability({ id: undefined });
      const savedDoc = createMockAvailabilityDoc();

      mockSave.mockResolvedValue(savedDoc);

      const result = await repository.save(availability);

      expect(MockAvailabilityModelConstructor).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Availability);
      expect(result.id).toBe('availability-123');
    });
  });

  describe('update', () => {
    it('should update existing availability by id', async () => {
      const availability = createAvailability();
      const updatedDoc = createMockAvailabilityDoc();

      const execMock = jest.fn().mockResolvedValue(updatedDoc);
      mockAvailabilityModel.findOneAndUpdate.mockReturnValue({
        exec: execMock,
      });

      const result = await repository.update(availability);

      expect(mockAvailabilityModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'availability-123' },
        expect.any(Object),
        { new: true, runValidators: true, upsert: true }
      );
      expect(result).toBeInstanceOf(Availability);
    });

    it('should update existing document when availability has no id', async () => {
      const availability = createAvailability({ id: undefined });
      const existingDoc = createMockAvailabilityDoc();
      const updatedDoc = createMockAvailabilityDoc();

      mockAvailabilityModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existingDoc),
      });
      const execMock = jest.fn().mockResolvedValue(updatedDoc);
      mockAvailabilityModel.findOneAndUpdate.mockReturnValue({
        exec: execMock,
      });

      const result = await repository.update(availability);

      expect(mockAvailabilityModel.findOneAndUpdate).toHaveBeenCalledWith(
        {},
        expect.any(Object),
        { new: true, runValidators: true, upsert: true }
      );
      expect(result).toBeInstanceOf(Availability);
    });

    it('should create new document when availability has no id and none exists', async () => {
      const availability = createAvailability();
      const execMock = jest.fn().mockResolvedValue(null);
      mockAvailabilityModel.findOneAndUpdate.mockReturnValue({
        exec: execMock,
      });

      await expect(repository.update(availability)).rejects.toThrow(
        'Erreur lors de la mise à jour de la disponibilité'
      );
    });
  });

  describe('domain mapping', () => {
    it('should correctly map weekly slots', async () => {
      const mockDoc = createMockAvailabilityDoc({
        weeklySlots: [{ dayOfWeek: 0, startTime: '10:00', endTime: '16:00' }],
      });
      mockAvailabilityModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDoc),
      });

      const result = await repository.find();

      expect(result?.weeklySlots[0].dayOfWeek).toBe(0);
      expect(result?.weeklySlots[0].startTime).toBe('10:00');
      expect(result?.weeklySlots[0].endTime).toBe('16:00');
    });

    it('should correctly map exceptions', async () => {
      const mockDoc = createMockAvailabilityDoc({
        exceptions: [
          {
            startDate: new Date('2024-07-14'),
            endDate: new Date('2024-07-14'),
            reason: 'Fête nationale',
          },
        ],
      });
      mockAvailabilityModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDoc),
      });

      const result = await repository.find();

      expect(result?.exceptions[0].reason).toBe('Fête nationale');
    });
  });
});
