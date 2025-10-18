import 'reflect-metadata';
import { UpdateWebsiteName } from '@/application/settings/UpdateWebsiteName';
import { WebsiteSettings } from '@/domain/settings/entities/WebsiteSettings';
import { WebsiteName } from '@/domain/settings/value-objects/WebsiteName';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';

describe('UpdateWebsiteName', () => {
  let mockRepository: jest.Mocked<WebsiteSettingsRepository>;
  let useCase: UpdateWebsiteName;

  beforeEach(() => {
    mockRepository = {
      getSettingsByKey: jest.fn(),
      updateSettings: jest.fn(),
      updateIcon: jest.fn(),
      getIcon: jest.fn(),
    } as jest.Mocked<WebsiteSettingsRepository>;
    useCase = new UpdateWebsiteName(mockRepository);
  });

  it('should update website name successfully', async () => {
    const existingSettings = new WebsiteSettings(
      'name',
      new WebsiteName('Old Name')
    );
    mockRepository.getSettingsByKey.mockResolvedValue(existingSettings);

    await useCase.execute({ name: 'New Name' });

    expect(mockRepository.getSettingsByKey).toHaveBeenCalledWith('name');
    expect(mockRepository.updateSettings).toHaveBeenCalledWith(
      existingSettings
    );
    expect(existingSettings.name.value).toBe('New Name');
  });

  it('should throw error for invalid name', async () => {
    const existingSettings = new WebsiteSettings(
      'name',
      new WebsiteName('Old Name')
    );
    mockRepository.getSettingsByKey.mockResolvedValue(existingSettings);

    await expect(useCase.execute({ name: '' })).rejects.toThrow(
      'Website name cannot be empty'
    );
  });
});
