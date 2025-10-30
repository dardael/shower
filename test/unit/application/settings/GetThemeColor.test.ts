import 'reflect-metadata';
import { GetThemeColor } from '@/application/settings/GetThemeColor';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { WebsiteSettings } from '@/domain/settings/entities/WebsiteSettings';
import { ThemeColor } from '@/domain/settings/value-objects/ThemeColor';
import { WebsiteName } from '@/domain/settings/value-objects/WebsiteName';

// Mock dependencies
const mockWebsiteSettingsRepository: jest.Mocked<WebsiteSettingsRepository> = {
  getSettingsByKey: jest.fn(),
  updateSettings: jest.fn(),
  updateIcon: jest.fn(),
  getIcon: jest.fn(),
};

describe('GetThemeColor', () => {
  let useCase: GetThemeColor;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetThemeColor(mockWebsiteSettingsRepository);
  });

  it('should return the theme color from repository', async () => {
    const themeColor = ThemeColor.create('blue');
    const websiteName = new WebsiteName('Test Website');
    const settings = new WebsiteSettings('website', websiteName);
    settings.updateThemeColor(themeColor);

    mockWebsiteSettingsRepository.getSettingsByKey.mockResolvedValue(settings);

    const result = await useCase.execute();

    expect(mockWebsiteSettingsRepository.getSettingsByKey).toHaveBeenCalledWith(
      'website'
    );
    expect(result.equals(themeColor)).toBe(true);
    expect(result.value).toBe('blue');
  });

  it('should return default theme color when repository throws error', async () => {
    const error = new Error('Database connection failed');

    mockWebsiteSettingsRepository.getSettingsByKey.mockRejectedValue(error);

    const result = await useCase.execute();

    expect(mockWebsiteSettingsRepository.getSettingsByKey).toHaveBeenCalledWith(
      'website'
    );
    expect(result.value).toBe('blue'); // Default theme color
  });

  it('should return default theme color when settings do not exist', async () => {
    const error = new Error('Settings not found');

    mockWebsiteSettingsRepository.getSettingsByKey.mockRejectedValue(error);

    const result = await useCase.execute();

    expect(result.value).toBe('blue'); // Default theme color
  });
});
