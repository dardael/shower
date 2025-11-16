import 'reflect-metadata';
import { GetThemeColor } from '@/application/settings/GetThemeColor';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { WebsiteSetting } from '@/domain/settings/entities/WebsiteSetting';

// Mock dependencies
const mockWebsiteSettingsRepository: jest.Mocked<WebsiteSettingsRepository> = {
  getByKey: jest.fn(),
  setByKey: jest.fn(),
};

describe('GetThemeColor', () => {
  let useCase: GetThemeColor;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetThemeColor(mockWebsiteSettingsRepository);
  });

  it('should return the theme color from repository', async () => {
    const setting = new WebsiteSetting('theme-color', 'blue');

    mockWebsiteSettingsRepository.getByKey.mockResolvedValue(setting);

    const result = await useCase.execute();

    expect(mockWebsiteSettingsRepository.getByKey).toHaveBeenCalledWith(
      'theme-color'
    );
    expect(result.value).toBe('blue');
  });

  it('should return default theme color when repository throws error', async () => {
    const error = new Error('Database connection failed');

    mockWebsiteSettingsRepository.getByKey.mockRejectedValue(error);

    const result = await useCase.execute();

    expect(mockWebsiteSettingsRepository.getByKey).toHaveBeenCalledWith(
      'theme-color'
    );
    expect(result.value).toBe('blue'); // Default theme color
  });

  it('should return default theme color when settings do not exist', async () => {
    const error = new Error('Settings not found');

    mockWebsiteSettingsRepository.getByKey.mockRejectedValue(error);

    const result = await useCase.execute();

    expect(result.value).toBe('blue'); // Default theme color
  });
});
