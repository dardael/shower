import 'reflect-metadata';
import { GetWebsiteIcon } from '@/application/settings/GetWebsiteIcon';
import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';
import { WebsiteSetting } from '@/domain/settings/entities/WebsiteSetting';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';

describe('GetWebsiteIcon', () => {
  let mockRepository: jest.Mocked<WebsiteSettingsRepository>;
  let useCase: GetWebsiteIcon;

  beforeEach(() => {
    mockRepository = {
      getByKey: jest.fn(),
      setByKey: jest.fn(),
      exists: jest.fn(),
    } as jest.Mocked<WebsiteSettingsRepository>;
    useCase = new GetWebsiteIcon(mockRepository);
  });

  it('should return website icon when it exists', async () => {
    const mockIconMetadata = {
      filename: 'favicon-123.ico',
      originalName: 'favicon.ico',
      size: 1024,
      format: 'ico',
      mimeType: 'image/x-icon',
      uploadedAt: new Date('2024-01-01T00:00:00Z'),
    };

    const iconValue = {
      url: 'https://example.com/favicon.ico',
      metadata: mockIconMetadata,
    };

    const setting = new WebsiteSetting('website-icon', iconValue);
    mockRepository.getByKey.mockResolvedValue(setting);

    const result = await useCase.execute();

    expect(mockRepository.getByKey).toHaveBeenCalledWith('website-icon');
    expect(result).toBeInstanceOf(WebsiteIcon);
    expect(result?.url).toBe('https://example.com/favicon.ico');
    expect(result?.filename).toBe('favicon-123.ico');
  });

  it('should return null when no icon exists', async () => {
    const setting = new WebsiteSetting('website-icon', null);
    mockRepository.getByKey.mockResolvedValue(setting);

    const result = await useCase.execute();

    expect(mockRepository.getByKey).toHaveBeenCalledWith('website-icon');
    expect(result).toBeNull();
  });

  it('should return null on repository errors', async () => {
    const error = new Error('Repository error');
    mockRepository.getByKey.mockRejectedValue(error);

    const result = await useCase.execute();

    expect(result).toBeNull(); // Default website icon
  });
});
