import { WebsiteSettings } from '@/domain/settings/entities/WebsiteSettings';
import { WebsiteName } from '@/domain/settings/value-objects/WebsiteName';

// Mock the WebsiteSettingsModel
const mockWebsiteSettingsModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
};

jest.mock('@/infrastructure/settings/models/WebsiteSettingsModel', () => ({
  WebsiteSettingsModel: mockWebsiteSettingsModel,
}));

import { MongooseWebsiteSettingsRepository } from '@/infrastructure/settings/repositories/MongooseWebsiteSettingsRepository';
describe('MongooseWebsiteSettingsRepository', () => {
  let repository: MongooseWebsiteSettingsRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new MongooseWebsiteSettingsRepository();
  });

  describe('getSettingsByKey', () => {
    it('should return existing settings when document exists', async () => {
      const mockDoc = {
        key: 'test-key',
        name: 'My Website',
      };

      mockWebsiteSettingsModel.findOne.mockResolvedValue(mockDoc);

      const result = await repository.getSettingsByKey('test-key');

      expect(mockWebsiteSettingsModel.findOne).toHaveBeenCalledWith({
        key: 'test-key',
      });
      expect(result).toBeInstanceOf(WebsiteSettings);
      expect(result.key).toBe('test-key');
      expect(result.name.value).toBe('My Website');
    });

    it('should create and return default settings when document does not exist', async () => {
      const mockCreatedDoc = {
        key: 'new-key',
        name: 'Shower',
      };

      mockWebsiteSettingsModel.findOne.mockResolvedValue(null);
      mockWebsiteSettingsModel.create.mockResolvedValue(mockCreatedDoc);

      const result = await repository.getSettingsByKey('new-key');

      expect(mockWebsiteSettingsModel.findOne).toHaveBeenCalledWith({
        key: 'new-key',
      });
      expect(mockWebsiteSettingsModel.create).toHaveBeenCalledWith({
        key: 'new-key',
        name: 'Shower',
      });
      expect(result).toBeInstanceOf(WebsiteSettings);
      expect(result.key).toBe('new-key');
      expect(result.name.value).toBe('Shower');
    });

    it('should handle errors from database operations', async () => {
      const error = new Error('Database connection failed');
      mockWebsiteSettingsModel.findOne.mockRejectedValue(error);

      await expect(repository.getSettingsByKey('test-key')).rejects.toThrow(
        'Database connection failed'
      );
    });
  });

  describe('updateSettings', () => {
    it('should update existing settings', async () => {
      const websiteName = new WebsiteName('Updated Website');
      const settings = new WebsiteSettings('test-key', websiteName);

      mockWebsiteSettingsModel.updateOne.mockResolvedValue({
        acknowledged: true,
      });

      await expect(
        repository.updateSettings(settings)
      ).resolves.toBeUndefined();

      expect(mockWebsiteSettingsModel.updateOne).toHaveBeenCalledWith(
        { key: 'test-key' },
        { name: 'Updated Website' },
        { upsert: true }
      );
    });

    it('should create new settings when upserting', async () => {
      const websiteName = new WebsiteName('New Website');
      const settings = new WebsiteSettings('new-key', websiteName);

      mockWebsiteSettingsModel.updateOne.mockResolvedValue({
        acknowledged: true,
      });

      await expect(
        repository.updateSettings(settings)
      ).resolves.toBeUndefined();

      expect(mockWebsiteSettingsModel.updateOne).toHaveBeenCalledWith(
        { key: 'new-key' },
        { name: 'New Website' },
        { upsert: true }
      );
    });

    it('should handle errors during update', async () => {
      const websiteName = new WebsiteName('Test Website');
      const settings = new WebsiteSettings('test-key', websiteName);
      const error = new Error('Update failed');

      mockWebsiteSettingsModel.updateOne.mockRejectedValue(error);

      await expect(repository.updateSettings(settings)).rejects.toThrow(
        'Update failed'
      );
    });
  });
});
