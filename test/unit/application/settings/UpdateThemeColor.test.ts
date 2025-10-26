import 'reflect-metadata';
import { UpdateThemeColor } from '@/application/settings/UpdateThemeColor';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { WebsiteSettings } from '@/domain/settings/entities/WebsiteSettings';
import { ThemeColor } from '@/domain/settings/value-objects/ThemeColor';
import { WebsiteName } from '@/domain/settings/value-objects/WebsiteName';
import type { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';

// Mock dependencies
const mockWebsiteSettingsRepository: jest.Mocked<WebsiteSettingsRepository> = {
  getSettingsByKey: jest.fn(),
  updateSettings: jest.fn(),
  updateIcon: jest.fn(),
  getIcon: jest.fn(),
};

describe('UpdateThemeColor', () => {
  let useCase: UpdateThemeColor;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateThemeColor(mockWebsiteSettingsRepository);
  });

  it('should update existing settings with new theme color', async () => {
    const existingThemeColor = ThemeColor.create('blue');
    const newThemeColor = ThemeColor.create('red');
    const websiteName = new WebsiteName('Test Website');
    const existingSettings = new WebsiteSettings('website', websiteName);
    existingSettings.updateThemeColor(existingThemeColor);

    mockWebsiteSettingsRepository.getSettingsByKey.mockResolvedValue(
      existingSettings
    );
    mockWebsiteSettingsRepository.updateSettings.mockResolvedValue(undefined);

    await useCase.execute(newThemeColor);

    expect(mockWebsiteSettingsRepository.getSettingsByKey).toHaveBeenCalledWith(
      'website'
    );
    expect(mockWebsiteSettingsRepository.updateSettings).toHaveBeenCalledWith(
      existingSettings
    );
    expect(existingSettings.themeColor.equals(newThemeColor)).toBe(true);
  });

  it('should create new settings when settings do not exist', async () => {
    const newThemeColor = ThemeColor.create('green');
    const error = new Error('Settings not found');

    mockWebsiteSettingsRepository.getSettingsByKey.mockRejectedValue(error);
    mockWebsiteSettingsRepository.updateSettings.mockResolvedValue(undefined);

    await useCase.execute(newThemeColor);

    expect(mockWebsiteSettingsRepository.getSettingsByKey).toHaveBeenCalledWith(
      'website'
    );
    expect(mockWebsiteSettingsRepository.updateSettings).toHaveBeenCalledWith(
      expect.any(WebsiteSettings)
    );

    const createdSettings = mockWebsiteSettingsRepository.updateSettings.mock
      .calls[0][0] as WebsiteSettings;
    expect(createdSettings.themeColor.equals(newThemeColor)).toBe(true);
    expect(createdSettings.name.value).toBe('Shower'); // Default name
    expect(createdSettings.key).toBe('website');
  });

  it('should handle repository errors gracefully', async () => {
    const newThemeColor = ThemeColor.create('purple');
    const error = new Error('Database connection failed');

    mockWebsiteSettingsRepository.getSettingsByKey.mockRejectedValue(error);
    mockWebsiteSettingsRepository.updateSettings.mockRejectedValue(error);

    await expect(useCase.execute(newThemeColor)).rejects.toThrow(
      'Database connection failed'
    );
  });

  it('should update settings with different theme colors', async () => {
    const colors: ThemeColorToken[] = [
      'blue',
      'red',
      'green',
      'purple',
      'orange',
      'teal',
      'pink',
      'cyan',
    ];

    for (const color of colors) {
      jest.clearAllMocks();

      const newThemeColor = ThemeColor.create(color);
      const websiteName = new WebsiteName('Test Website');
      const existingSettings = new WebsiteSettings('website', websiteName);

      mockWebsiteSettingsRepository.getSettingsByKey.mockResolvedValue(
        existingSettings
      );
      mockWebsiteSettingsRepository.updateSettings.mockResolvedValue(undefined);

      await useCase.execute(newThemeColor);

      expect(mockWebsiteSettingsRepository.updateSettings).toHaveBeenCalledWith(
        existingSettings
      );
      expect(existingSettings.themeColor.equals(newThemeColor)).toBe(true);
    }
  });
});
