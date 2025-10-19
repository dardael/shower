import 'reflect-metadata';
import { GetWebsiteIcon } from '@/application/settings/GetWebsiteIcon';
import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';

describe('GetWebsiteIcon', () => {
  let mockRepository: jest.Mocked<WebsiteSettingsRepository>;
  let useCase: GetWebsiteIcon;

  beforeEach(() => {
    mockRepository = {
      getSettingsByKey: jest.fn(),
      updateSettings: jest.fn(),
      updateIcon: jest.fn(),
      getIcon: jest.fn(),
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

    const expectedIcon = new WebsiteIcon(
      'https://example.com/favicon.ico',
      mockIconMetadata
    );
    mockRepository.getIcon.mockResolvedValue(expectedIcon);

    const result = await useCase.execute('test-key');

    expect(mockRepository.getIcon).toHaveBeenCalledWith('test-key');
    expect(result).toBe(expectedIcon);
    expect(result?.url).toBe('https://example.com/favicon.ico');
    expect(result?.filename).toBe('favicon-123.ico');
  });

  it('should return null when no icon exists', async () => {
    mockRepository.getIcon.mockResolvedValue(null);

    const result = await useCase.execute('test-key');

    expect(mockRepository.getIcon).toHaveBeenCalledWith('test-key');
    expect(result).toBeNull();
  });

  it('should handle repository errors', async () => {
    const error = new Error('Repository error');
    mockRepository.getIcon.mockRejectedValue(error);

    await expect(useCase.execute('test-key')).rejects.toThrow(
      'Repository error'
    );
  });
});
