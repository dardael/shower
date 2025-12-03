import 'reflect-metadata';
import { UpdateWebsiteFont } from '@/application/settings/UpdateWebsiteFont';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { WebsiteFont } from '@/domain/settings/value-objects/WebsiteFont';

// Mock dependencies
const mockWebsiteSettingsRepository: jest.Mocked<WebsiteSettingsRepository> = {
  getByKey: jest.fn(),
  setByKey: jest.fn(),
};

describe('UpdateWebsiteFont', () => {
  let useCase: UpdateWebsiteFont;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateWebsiteFont(mockWebsiteSettingsRepository);
  });

  it('should update the website font in repository', async () => {
    const websiteFont = WebsiteFont.create('Roboto');

    mockWebsiteSettingsRepository.setByKey.mockResolvedValue(undefined);

    await useCase.execute(websiteFont);

    expect(mockWebsiteSettingsRepository.setByKey).toHaveBeenCalledWith(
      'website-font',
      'Roboto'
    );
  });

  it('should handle different font names', async () => {
    const websiteFont = WebsiteFont.create('Playfair Display');

    mockWebsiteSettingsRepository.setByKey.mockResolvedValue(undefined);

    await useCase.execute(websiteFont);

    expect(mockWebsiteSettingsRepository.setByKey).toHaveBeenCalledWith(
      'website-font',
      'Playfair Display'
    );
  });

  it('should propagate errors from repository', async () => {
    const websiteFont = WebsiteFont.create('Inter');
    const error = new Error('Database error');

    mockWebsiteSettingsRepository.setByKey.mockRejectedValue(error);

    await expect(useCase.execute(websiteFont)).rejects.toThrow(
      'Database error'
    );
  });
});
