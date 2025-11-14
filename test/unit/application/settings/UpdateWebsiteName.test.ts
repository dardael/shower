import 'reflect-metadata';
import { UpdateWebsiteName } from '@/application/settings/UpdateWebsiteName';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';

describe('UpdateWebsiteName', () => {
  let mockRepository: jest.Mocked<WebsiteSettingsRepository>;
  let useCase: UpdateWebsiteName;

  beforeEach(() => {
    mockRepository = {
      getByKey: jest.fn(),
      setByKey: jest.fn(),
      exists: jest.fn(),
    } as jest.Mocked<WebsiteSettingsRepository>;
    useCase = new UpdateWebsiteName(mockRepository);
  });

  it('should update website name successfully', async () => {
    mockRepository.setByKey.mockResolvedValue();

    await useCase.execute({ name: 'New Name' });

    expect(mockRepository.setByKey).toHaveBeenCalledWith(
      'website-name',
      'New Name'
    );
  });

  it('should throw error for invalid name', async () => {
    await expect(useCase.execute({ name: '' })).rejects.toThrow(
      'Website name cannot be empty'
    );
  });
});
