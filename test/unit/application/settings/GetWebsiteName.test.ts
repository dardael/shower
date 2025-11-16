import 'reflect-metadata';
import { GetWebsiteName } from '@/application/settings/GetWebsiteName';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { WebsiteSetting } from '@/domain/settings/entities/WebsiteSetting';

// Mock dependencies
const mockWebsiteSettingsRepository: jest.Mocked<WebsiteSettingsRepository> = {
  getByKey: jest.fn(),
  setByKey: jest.fn(),
};

describe('GetWebsiteName', () => {
  let useCase: GetWebsiteName;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetWebsiteName(mockWebsiteSettingsRepository);
  });

  it('should return the website name from repository', async () => {
    const setting = new WebsiteSetting('website-name', 'My Website');

    mockWebsiteSettingsRepository.getByKey.mockResolvedValue(setting);

    const result = await useCase.execute();

    expect(mockWebsiteSettingsRepository.getByKey).toHaveBeenCalledWith(
      'website-name'
    );
    expect(result).toBe('My Website');
  });

  it('should return default value on repository error', async () => {
    const error = new Error('Database connection failed');

    mockWebsiteSettingsRepository.getByKey.mockRejectedValue(error);

    const result = await useCase.execute();

    expect(result).toBe('Shower'); // Default website name
  });
});
