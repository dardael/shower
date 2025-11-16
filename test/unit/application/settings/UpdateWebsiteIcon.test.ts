import 'reflect-metadata';
import { UpdateWebsiteIcon } from '@/application/settings/UpdateWebsiteIcon';
import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';

describe('UpdateWebsiteIcon', () => {
  let mockRepository: jest.Mocked<WebsiteSettingsRepository>;
  let useCase: UpdateWebsiteIcon;

  beforeEach(() => {
    mockRepository = {
      getByKey: jest.fn(),
      setByKey: jest.fn(),
      exists: jest.fn(),
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

    const expectedIconValue = {
      url: 'https://example.com/favicon.ico',
      metadata: mockIconMetadata,
    };

    await useCase.execute(icon);

    expect(mockRepository.setByKey).toHaveBeenCalledWith(
      'website-icon',
      expectedIconValue
    );
  });

  it('should remove website icon successfully', async () => {
    await useCase.execute(null);

    expect(mockRepository.setByKey).toHaveBeenCalledWith('website-icon', null);
  });

  it('should handle repository errors', async () => {
    const error = new Error('Repository error');
    mockRepository.setByKey.mockRejectedValue(error);

    await expect(useCase.execute(null)).rejects.toThrow('Repository error');
  });
});
