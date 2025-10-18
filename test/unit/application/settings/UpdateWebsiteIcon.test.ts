import 'reflect-metadata';
import { UpdateWebsiteIcon } from '@/application/settings/UpdateWebsiteIcon';
import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';

describe('UpdateWebsiteIcon', () => {
  let mockRepository: jest.Mocked<WebsiteSettingsRepository>;
  let useCase: UpdateWebsiteIcon;

  beforeEach(() => {
    mockRepository = {
      getSettingsByKey: jest.fn(),
      updateSettings: jest.fn(),
      updateIcon: jest.fn(),
      getIcon: jest.fn(),
    } as jest.Mocked<WebsiteSettingsRepository>;
    useCase = new UpdateWebsiteIcon(mockRepository);
  });

  it('should update website icon successfully', async () => {
    const mockIconMetadata = {
      filename: 'favicon-123.ico',
      originalName: 'favicon.ico',
      size: 1024,
      format: 'ico',
      mimeType: 'image/x-icon',
      uploadedAt: new Date('2024-01-01T00:00:00Z'),
    };

    const icon = new WebsiteIcon(
      'https://example.com/favicon.ico',
      mockIconMetadata
    );

    await useCase.execute('test-key', icon);

    expect(mockRepository.updateIcon).toHaveBeenCalledWith('test-key', icon);
  });

  it('should remove website icon successfully', async () => {
    await useCase.execute('test-key', null);

    expect(mockRepository.updateIcon).toHaveBeenCalledWith('test-key', null);
  });

  it('should handle repository errors', async () => {
    const error = new Error('Repository error');
    mockRepository.updateIcon.mockRejectedValue(error);

    await expect(useCase.execute('test-key', null)).rejects.toThrow(
      'Repository error'
    );
  });
});
