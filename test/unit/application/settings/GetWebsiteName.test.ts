import 'reflect-metadata';
import { GetWebsiteName } from '@/application/settings/GetWebsiteName';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { WebsiteSettings } from '@/domain/settings/entities/WebsiteSettings';
import { WebsiteName } from '@/domain/settings/value-objects/WebsiteName';

// Mock dependencies
const mockWebsiteSettingsRepository: jest.Mocked<WebsiteSettingsRepository> = {
  getSettingsByKey: jest.fn(),
  updateSettings: jest.fn(),
  updateIcon: jest.fn(),
  getIcon: jest.fn(),
};

describe('GetWebsiteName', () => {
  let useCase: GetWebsiteName;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetWebsiteName(mockWebsiteSettingsRepository);
  });

  it('should return the website name from repository', async () => {
    const websiteName = new WebsiteName('My Website');
    const settings = new WebsiteSettings('name', websiteName);

    mockWebsiteSettingsRepository.getSettingsByKey.mockResolvedValue(settings);

    const result = await useCase.execute();

    expect(mockWebsiteSettingsRepository.getSettingsByKey).toHaveBeenCalledWith(
      'name'
    );
    expect(result).toBe('My Website');
  });

  it('should handle repository error', async () => {
    const error = new Error('Database connection failed');

    mockWebsiteSettingsRepository.getSettingsByKey.mockRejectedValue(error);

    await expect(useCase.execute()).rejects.toThrow(
      'Database connection failed'
    );
  });
});
