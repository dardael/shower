import 'reflect-metadata';
import { UpdateThemeColor } from '@/application/settings/UpdateThemeColor';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { ThemeColor } from '@/domain/settings/value-objects/ThemeColor';
import type { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';

// Mock dependencies
const mockWebsiteSettingsRepository: jest.Mocked<WebsiteSettingsRepository> = {
  getByKey: jest.fn(),
  setByKey: jest.fn(),
};

describe('UpdateThemeColor', () => {
  let useCase: UpdateThemeColor;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateThemeColor(mockWebsiteSettingsRepository);
  });

  it('should update theme color successfully', async () => {
    const newThemeColor = ThemeColor.create('red');

    mockWebsiteSettingsRepository.setByKey.mockResolvedValue(undefined);

    await useCase.execute(newThemeColor);

    expect(mockWebsiteSettingsRepository.setByKey).toHaveBeenCalledWith(
      'theme-color',
      'red'
    );
  });

  it('should handle repository errors gracefully', async () => {
    const newThemeColor = ThemeColor.create('purple');
    const error = new Error('Database connection failed');

    mockWebsiteSettingsRepository.setByKey.mockRejectedValue(error);

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
      mockWebsiteSettingsRepository.setByKey.mockResolvedValue(undefined);

      await useCase.execute(newThemeColor);

      expect(mockWebsiteSettingsRepository.setByKey).toHaveBeenCalledWith(
        'theme-color',
        color
      );
    }
  });
});
