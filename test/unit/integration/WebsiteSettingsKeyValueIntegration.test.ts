import 'reflect-metadata';

// Mock the model for integration testing - must be defined before imports
const mockWebsiteSettingsModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
};

jest.mock('@/infrastructure/settings/models/WebsiteSettingsModel', () => ({
  WebsiteSettingsModel: mockWebsiteSettingsModel,
}));

import { MongooseWebsiteSettingsRepository } from '@/infrastructure/settings/repositories/MongooseWebsiteSettingsRepository';
import { WebsiteSetting } from '@/domain/settings/entities/WebsiteSetting';
import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';
import { ThemeColor } from '@/domain/settings/value-objects/ThemeColor';
import { GetWebsiteName } from '@/application/settings/GetWebsiteName';
import { UpdateWebsiteName } from '@/application/settings/UpdateWebsiteName';
import { GetWebsiteIcon } from '@/application/settings/GetWebsiteIcon';
import { UpdateWebsiteIcon } from '@/application/settings/UpdateWebsiteIcon';
import { GetThemeColor } from '@/application/settings/GetThemeColor';
import { UpdateThemeColor } from '@/application/settings/UpdateThemeColor';
import { Logger } from '@/application/shared/Logger';

describe('WebsiteSettings Key-Value Integration Tests', () => {
  let repository: MongooseWebsiteSettingsRepository;
  let getWebsiteName: GetWebsiteName;
  let updateWebsiteName: UpdateWebsiteName;
  let getWebsiteIcon: GetWebsiteIcon;
  let updateWebsiteIcon: UpdateWebsiteIcon;
  let getThemeColor: GetThemeColor;
  let updateThemeColor: UpdateThemeColor;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Logger for repository
    const mockLogger = {
      warn: jest.fn(),
    } as unknown as Logger;

    repository = new MongooseWebsiteSettingsRepository(mockLogger);
    getWebsiteName = new GetWebsiteName(repository);
    updateWebsiteName = new UpdateWebsiteName(repository);
    getWebsiteIcon = new GetWebsiteIcon(repository);
    updateWebsiteIcon = new UpdateWebsiteIcon(repository);
    getThemeColor = new GetThemeColor(repository);
    updateThemeColor = new UpdateThemeColor(repository);
  });

  describe('Website Name Operations', () => {
    it('should handle complete website name workflow', async () => {
      // Initial state - no document exists
      mockWebsiteSettingsModel.findOne.mockResolvedValue(null);
      mockWebsiteSettingsModel.create.mockResolvedValue({
        key: 'website-name',
        value: 'Shower',
      });

      // Get default name
      const initialName = await getWebsiteName.execute();
      expect(initialName).toBe('Shower');
      expect(mockWebsiteSettingsModel.create).toHaveBeenCalledWith({
        key: 'website-name',
        value: 'Shower',
      });

      // Update name
      mockWebsiteSettingsModel.updateOne.mockResolvedValue({
        acknowledged: true,
      });
      await updateWebsiteName.execute({ name: 'My Awesome Website' });

      expect(mockWebsiteSettingsModel.updateOne).toHaveBeenCalledWith(
        { key: 'website-name' },
        { value: 'My Awesome Website' },
        { upsert: true }
      );

      // Get updated name
      mockWebsiteSettingsModel.findOne.mockResolvedValue({
        key: 'website-name',
        value: 'My Awesome Website',
      });

      const updatedName = await getWebsiteName.execute();
      expect(updatedName).toBe('My Awesome Website');
    });
  });

  describe('Website Icon Operations', () => {
    const mockIconMetadata = {
      filename: 'favicon-123.ico',
      originalName: 'favicon.ico',
      size: 1024,
      format: 'ico',
      mimeType: 'image/x-icon',
      uploadedAt: new Date('2024-01-01T00:00:00Z'),
    };

    it('should handle complete website icon workflow', async () => {
      // Initial state - no icon exists
      mockWebsiteSettingsModel.findOne.mockResolvedValue(null);
      mockWebsiteSettingsModel.create.mockResolvedValue({
        key: 'website-icon',
        value: null,
      });

      // Get null icon
      const initialIcon = await getWebsiteIcon.execute();
      expect(initialIcon).toBeNull();

      // Set icon
      const icon = new WebsiteIcon(
        'https://example.com/favicon.ico',
        mockIconMetadata
      );

      mockWebsiteSettingsModel.updateOne.mockResolvedValue({
        acknowledged: true,
      });
      await updateWebsiteIcon.execute(icon);

      const expectedIconValue = {
        url: 'https://example.com/favicon.ico',
        metadata: mockIconMetadata,
      };

      expect(mockWebsiteSettingsModel.updateOne).toHaveBeenCalledWith(
        { key: 'website-icon' },
        { value: expectedIconValue },
        { upsert: true }
      );

      // Get updated icon
      mockWebsiteSettingsModel.findOne.mockResolvedValue({
        key: 'website-icon',
        value: expectedIconValue,
      });

      const retrievedIcon = await getWebsiteIcon.execute();
      expect(retrievedIcon).not.toBeNull();
      expect(retrievedIcon?.url).toBe('https://example.com/favicon.ico');
      expect(retrievedIcon?.filename).toBe('favicon-123.ico');

      // Remove icon
      await updateWebsiteIcon.execute(null);

      expect(mockWebsiteSettingsModel.updateOne).toHaveBeenCalledWith(
        { key: 'website-icon' },
        { value: null },
        { upsert: true }
      );
    });
  });

  describe('Theme Color Operations', () => {
    it('should handle complete theme color workflow', async () => {
      // Initial state - no document exists
      mockWebsiteSettingsModel.findOne.mockResolvedValue(null);
      mockWebsiteSettingsModel.create.mockResolvedValue({
        key: 'theme-color',
        value: 'blue',
      });

      // Get default theme color
      const initialThemeColor = await getThemeColor.execute();
      expect(initialThemeColor.value).toBe('blue');

      // Update theme color
      const newThemeColor = ThemeColor.fromString('red');
      mockWebsiteSettingsModel.updateOne.mockResolvedValue({
        acknowledged: true,
      });
      await updateThemeColor.execute(newThemeColor);

      expect(mockWebsiteSettingsModel.updateOne).toHaveBeenCalledWith(
        { key: 'theme-color' },
        { value: 'red' },
        { upsert: true }
      );

      // Get updated theme color
      mockWebsiteSettingsModel.findOne.mockResolvedValue({
        key: 'theme-color',
        value: 'red',
      });

      const updatedThemeColor = await getThemeColor.execute();
      expect(updatedThemeColor.value).toBe('red');
    });
  });

  describe('Cross-Setting Operations', () => {
    it('should handle multiple independent settings', async () => {
      // Setup different values for each setting
      const nameSetting = new WebsiteSetting('website-name', 'Test Site');
      const iconSetting = new WebsiteSetting('website-icon', null);
      const themeSetting = new WebsiteSetting('theme-color', 'green');

      mockWebsiteSettingsModel.findOne
        .mockResolvedValueOnce(nameSetting)
        .mockResolvedValueOnce(iconSetting)
        .mockResolvedValueOnce(themeSetting);

      // Get all settings independently
      const name = await getWebsiteName.execute();
      const icon = await getWebsiteIcon.execute();
      const themeColor = await getThemeColor.execute();

      expect(name).toBe('Test Site');
      expect(icon).toBeNull();
      expect(themeColor.value).toBe('green');

      // Verify each setting was fetched with correct key
      expect(mockWebsiteSettingsModel.findOne).toHaveBeenCalledWith({
        key: 'website-name',
      });
      expect(mockWebsiteSettingsModel.findOne).toHaveBeenCalledWith({
        key: 'website-icon',
      });
      expect(mockWebsiteSettingsModel.findOne).toHaveBeenCalledWith({
        key: 'theme-color',
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully across all operations', async () => {
      const dbError = new Error('Database connection failed');

      mockWebsiteSettingsModel.findOne.mockRejectedValue(dbError);

      // All get operations should have fallback to default values, so they should not throw
      const fallbackName = await getWebsiteName.execute();
      expect(fallbackName).toBe('Shower'); // Default website name

      const fallbackIcon = await getWebsiteIcon.execute();
      expect(fallbackIcon).toBeNull(); // Default website icon

      const fallbackColor = await getThemeColor.execute();
      expect(fallbackColor.value).toBe('blue'); // Default theme color

      // Update operations should handle errors
      mockWebsiteSettingsModel.updateOne.mockRejectedValue(dbError);

      await expect(updateWebsiteName.execute({ name: 'Test' })).rejects.toThrow(
        'Database connection failed'
      );

      const icon = new WebsiteIcon('https://example.com/favicon.ico', {
        filename: 'favicon.ico',
        originalName: 'favicon.ico',
        size: 1024,
        format: 'ico',
        mimeType: 'image/x-icon',
        uploadedAt: new Date(),
      });

      await expect(updateWebsiteIcon.execute(icon)).rejects.toThrow(
        'Database connection failed'
      );

      const themeColor = ThemeColor.fromString('blue');
      await expect(updateThemeColor.execute(themeColor)).rejects.toThrow(
        'Database connection failed'
      );
    });
  });

  describe('Default Value Creation', () => {
    it('should create appropriate default values for each setting type', async () => {
      mockWebsiteSettingsModel.findOne.mockResolvedValue(null);

      // Test website name default
      mockWebsiteSettingsModel.create.mockResolvedValue({
        key: 'website-name',
        value: 'Shower',
      });

      await getWebsiteName.execute();
      expect(mockWebsiteSettingsModel.create).toHaveBeenCalledWith({
        key: 'website-name',
        value: 'Shower',
      });

      // Test website icon default
      mockWebsiteSettingsModel.create.mockResolvedValue({
        key: 'website-icon',
        value: null,
      });

      await getWebsiteIcon.execute();
      expect(mockWebsiteSettingsModel.create).toHaveBeenCalledWith({
        key: 'website-icon',
        value: null,
      });

      // Test theme color default
      mockWebsiteSettingsModel.create.mockResolvedValue({
        key: 'theme-color',
        value: 'blue',
      });

      await getThemeColor.execute();
      expect(mockWebsiteSettingsModel.create).toHaveBeenCalledWith({
        key: 'theme-color',
        value: 'blue',
      });
    });
  });
});
