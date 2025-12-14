import { WebsiteSetting } from '@/domain/settings/entities/WebsiteSetting';
import { Logger } from '@/application/shared/Logger';

// Mock WebsiteSettingsModel
const mockWebsiteSettingsModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
};

jest.mock('@/infrastructure/settings/models/WebsiteSettingsModel', () => ({
  WebsiteSettingsModel: mockWebsiteSettingsModel,
}));

// Mock Logger
const mockLogger = {
  warn: jest.fn(),
} as unknown as Logger;

import { MongooseWebsiteSettingsRepository } from '@/infrastructure/settings/repositories/MongooseWebsiteSettingsRepository';

describe('MongooseWebsiteSettingsRepository', () => {
  let repository: MongooseWebsiteSettingsRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new MongooseWebsiteSettingsRepository(mockLogger);
  });

  describe('getByKey', () => {
    it('should return existing setting when document exists', async () => {
      const mockDoc = {
        key: 'website-name',
        value: 'My Website',
      };

      mockWebsiteSettingsModel.findOne.mockResolvedValue(mockDoc);

      const result = await repository.getByKey('website-name');

      expect(mockWebsiteSettingsModel.findOne).toHaveBeenCalledWith({
        key: 'website-name',
      });
      expect(result).toBeInstanceOf(WebsiteSetting);
      expect(result.key).toBe('website-name');
      expect(result.value).toBe('My Website');
    });

    it('should create and return default setting when document does not exist', async () => {
      const mockCreatedDoc = {
        key: 'website-name',
        value: 'Shower',
      };

      mockWebsiteSettingsModel.findOne.mockResolvedValue(null);
      mockWebsiteSettingsModel.create.mockResolvedValue(mockCreatedDoc);

      const result = await repository.getByKey('website-name');

      expect(mockWebsiteSettingsModel.findOne).toHaveBeenCalledWith({
        key: 'website-name',
      });
      expect(mockWebsiteSettingsModel.create).toHaveBeenCalledWith({
        key: 'website-name',
        value: 'Shower',
      });
      expect(result).toBeInstanceOf(WebsiteSetting);
      expect(result.key).toBe('website-name');
      expect(result.value).toBe('Shower');
    });

    it('should create default icon setting when document does not exist', async () => {
      const mockCreatedDoc = {
        key: 'website-icon',
        value: null,
      };

      mockWebsiteSettingsModel.findOne.mockResolvedValue(null);
      mockWebsiteSettingsModel.create.mockResolvedValue(mockCreatedDoc);

      const result = await repository.getByKey('website-icon');

      expect(mockWebsiteSettingsModel.create).toHaveBeenCalledWith({
        key: 'website-icon',
        value: null,
      });
      expect(result.key).toBe('website-icon');
      expect(result.value).toBe(null);
    });

    it('should create default theme color setting when document does not exist', async () => {
      const mockCreatedDoc = {
        key: 'theme-color',
        value: 'blue',
      };

      mockWebsiteSettingsModel.findOne.mockResolvedValue(null);
      mockWebsiteSettingsModel.create.mockResolvedValue(mockCreatedDoc);

      const result = await repository.getByKey('theme-color');

      expect(mockWebsiteSettingsModel.create).toHaveBeenCalledWith({
        key: 'theme-color',
        value: 'blue',
      });
      expect(result.key).toBe('theme-color');
      expect(result.value).toBe('blue');
    });

    it('should handle errors from database operations', async () => {
      const error = new Error('Database connection failed');
      mockWebsiteSettingsModel.findOne.mockRejectedValue(error);

      await expect(repository.getByKey('test-key')).rejects.toThrow(
        'Database connection failed'
      );
    });
  });

  describe('setByKey', () => {
    it('should update existing setting', async () => {
      mockWebsiteSettingsModel.updateOne.mockResolvedValue({
        acknowledged: true,
      });

      await expect(
        repository.setByKey('website-name', 'Updated Website')
      ).resolves.toBeUndefined();

      expect(mockWebsiteSettingsModel.updateOne).toHaveBeenCalledWith(
        { key: 'website-name' },
        { $set: { key: 'website-name', value: 'Updated Website' } },
        { upsert: true }
      );
    });

    it('should create new setting when upserting', async () => {
      mockWebsiteSettingsModel.updateOne.mockResolvedValue({
        acknowledged: true,
      });

      await expect(
        repository.setByKey('theme-color', 'red')
      ).resolves.toBeUndefined();

      expect(mockWebsiteSettingsModel.updateOne).toHaveBeenCalledWith(
        { key: 'theme-color' },
        { $set: { key: 'theme-color', value: 'red' } },
        { upsert: true }
      );
    });

    it('should set icon value', async () => {
      const iconValue = {
        url: 'https://example.com/favicon.ico',
        metadata: {
          filename: 'favicon.ico',
          originalName: 'favicon.ico',
          size: 1024,
          format: 'ico',
          mimeType: 'image/x-icon',
          uploadedAt: new Date('2024-01-01T00:00:00Z'),
        },
      };

      mockWebsiteSettingsModel.updateOne.mockResolvedValue({
        acknowledged: true,
      });

      await repository.setByKey('website-icon', iconValue);

      expect(mockWebsiteSettingsModel.updateOne).toHaveBeenCalledWith(
        { key: 'website-icon' },
        { $set: { key: 'website-icon', value: iconValue } },
        { upsert: true }
      );
    });

    it('should set null icon value', async () => {
      mockWebsiteSettingsModel.updateOne.mockResolvedValue({
        acknowledged: true,
      });

      await repository.setByKey('website-icon', null);

      expect(mockWebsiteSettingsModel.updateOne).toHaveBeenCalledWith(
        { key: 'website-icon' },
        { $set: { key: 'website-icon', value: null } },
        { upsert: true }
      );
    });

    it('should handle errors during update', async () => {
      const error = new Error('Update failed');
      mockWebsiteSettingsModel.updateOne.mockRejectedValue(error);

      await expect(repository.setByKey('test-key', 'value')).rejects.toThrow(
        'Update failed'
      );
    });
  });

  describe('mapDocumentToEntity', () => {
    it('should map document to entity correctly', async () => {
      const mockDoc = {
        key: 'website-name',
        value: 'Test Website',
      };

      mockWebsiteSettingsModel.findOne.mockResolvedValue(mockDoc);

      const result = await repository.getByKey('website-name');

      expect(result.key).toBe('website-name');
      expect(result.value).toBe('Test Website');
      expect(result.isString()).toBe(true);
      expect(result.isIcon()).toBe(false);
    });

    it('should map icon document to entity correctly', async () => {
      const iconValue = {
        url: 'https://example.com/favicon.ico',
        metadata: {
          filename: 'favicon.ico',
          originalName: 'favicon.ico',
          size: 1024,
          format: 'ico',
          mimeType: 'image/x-icon',
          uploadedAt: new Date('2024-01-01T00:00:00Z'),
        },
      };

      const mockDoc = {
        key: 'website-icon',
        value: iconValue,
      };

      mockWebsiteSettingsModel.findOne.mockResolvedValue(mockDoc);

      const result = await repository.getByKey('website-icon');

      expect(result.key).toBe('website-icon');
      expect(result.value).toEqual(iconValue);
      expect(result.isString()).toBe(false);
      expect(result.isIcon()).toBe(true);
    });
  });
});
