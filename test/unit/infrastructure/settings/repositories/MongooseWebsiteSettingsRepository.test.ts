import { WebsiteSettings } from '@/domain/settings/entities/WebsiteSettings';
import { WebsiteName } from '@/domain/settings/value-objects/WebsiteName';
import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';

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
        { name: 'Updated Website', icon: null },
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
        { name: 'New Website', icon: null },
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

  describe('icon functionality', () => {
    const mockIconMetadata = {
      filename: 'favicon-123.ico',
      originalName: 'favicon.ico',
      size: 1024,
      format: 'ico',
      mimeType: 'image/x-icon',
      uploadedAt: new Date('2024-01-01T00:00:00Z'),
    };

    it('should get settings with icon', async () => {
      const mockDoc = {
        key: 'test-key',
        name: 'My Website',
        icon: {
          url: 'https://example.com/favicon.ico',
          metadata: mockIconMetadata,
        },
      };

      mockWebsiteSettingsModel.findOne.mockResolvedValue(mockDoc);

      const result = await repository.getSettingsByKey('test-key');

      expect(result).toBeInstanceOf(WebsiteSettings);
      expect(result.key).toBe('test-key');
      expect(result.name.value).toBe('My Website');
      expect(result.icon).not.toBeNull();
      expect(result.icon?.url).toBe('https://example.com/favicon.ico');
      expect(result.icon?.filename).toBe('favicon-123.ico');
    });

    it('should get settings without icon', async () => {
      const mockDoc = {
        key: 'test-key',
        name: 'My Website',
        icon: null,
      };

      mockWebsiteSettingsModel.findOne.mockResolvedValue(mockDoc);

      const result = await repository.getSettingsByKey('test-key');

      expect(result.icon).toBeNull();
    });

    it('should update settings with icon', async () => {
      const websiteName = new WebsiteName('Updated Website');
      const icon = new WebsiteIcon(
        'https://example.com/favicon.ico',
        mockIconMetadata
      );
      const settings = new WebsiteSettings('test-key', websiteName, icon);

      mockWebsiteSettingsModel.updateOne.mockResolvedValue({
        acknowledged: true,
      });

      await repository.updateSettings(settings);

      expect(mockWebsiteSettingsModel.updateOne).toHaveBeenCalledWith(
        { key: 'test-key' },
        {
          name: 'Updated Website',
          icon: {
            url: 'https://example.com/favicon.ico',
            metadata: mockIconMetadata,
          },
        },
        { upsert: true }
      );
    });

    it('should update settings removing icon', async () => {
      const websiteName = new WebsiteName('Updated Website');
      const settings = new WebsiteSettings('test-key', websiteName, null);

      mockWebsiteSettingsModel.updateOne.mockResolvedValue({
        acknowledged: true,
      });

      await repository.updateSettings(settings);

      expect(mockWebsiteSettingsModel.updateOne).toHaveBeenCalledWith(
        { key: 'test-key' },
        {
          name: 'Updated Website',
          icon: null,
        },
        { upsert: true }
      );
    });

    it('should update icon only', async () => {
      const icon = new WebsiteIcon(
        'https://example.com/new-favicon.ico',
        mockIconMetadata
      );

      mockWebsiteSettingsModel.updateOne.mockResolvedValue({
        acknowledged: true,
      });

      await repository.updateIcon('test-key', icon);

      expect(mockWebsiteSettingsModel.updateOne).toHaveBeenCalledWith(
        { key: 'test-key' },
        {
          icon: {
            url: 'https://example.com/new-favicon.ico',
            metadata: mockIconMetadata,
          },
        },
        { upsert: true }
      );
    });

    it('should remove icon only', async () => {
      mockWebsiteSettingsModel.updateOne.mockResolvedValue({
        acknowledged: true,
      });

      await repository.updateIcon('test-key', null);

      expect(mockWebsiteSettingsModel.updateOne).toHaveBeenCalledWith(
        { key: 'test-key' },
        { icon: null },
        { upsert: true }
      );
    });

    it('should get icon only', async () => {
      const mockDoc = {
        icon: {
          url: 'https://example.com/favicon.ico',
          metadata: mockIconMetadata,
        },
      };

      mockWebsiteSettingsModel.findOne.mockResolvedValue(mockDoc);

      const result = await repository.getIcon('test-key');

      expect(result).not.toBeNull();
      expect(result?.url).toBe('https://example.com/favicon.ico');
      expect(result?.filename).toBe('favicon-123.ico');
    });

    it('should return null when no icon exists', async () => {
      const mockDoc = {
        icon: null,
      };

      mockWebsiteSettingsModel.findOne.mockResolvedValue(mockDoc);

      const result = await repository.getIcon('test-key');

      expect(result).toBeNull();
    });

    it('should return null when settings document does not exist', async () => {
      mockWebsiteSettingsModel.findOne.mockResolvedValue(null);

      const result = await repository.getIcon('test-key');

      expect(result).toBeNull();
    });
  });
});
