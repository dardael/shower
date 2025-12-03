import 'reflect-metadata';
import { GetWebsiteFont } from '@/application/settings/GetWebsiteFont';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { WebsiteSetting } from '@/domain/settings/entities/WebsiteSetting';
import { DEFAULT_FONT } from '@/domain/settings/constants/AvailableFonts';

// Mock dependencies
const mockWebsiteSettingsRepository: jest.Mocked<WebsiteSettingsRepository> = {
  getByKey: jest.fn(),
  setByKey: jest.fn(),
};

describe('GetWebsiteFont', () => {
  let useCase: GetWebsiteFont;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetWebsiteFont(mockWebsiteSettingsRepository);
  });

  it('should return the website font from repository', async () => {
    const setting = new WebsiteSetting('website-font', 'Roboto');

    mockWebsiteSettingsRepository.getByKey.mockResolvedValue(setting);

    const result = await useCase.execute();

    expect(mockWebsiteSettingsRepository.getByKey).toHaveBeenCalledWith(
      'website-font'
    );
    expect(result.value).toBe('Roboto');
  });

  it('should return default font when repository throws error', async () => {
    const error = new Error('Database connection failed');

    mockWebsiteSettingsRepository.getByKey.mockRejectedValue(error);

    const result = await useCase.execute();

    expect(mockWebsiteSettingsRepository.getByKey).toHaveBeenCalledWith(
      'website-font'
    );
    expect(result.value).toBe(DEFAULT_FONT);
  });

  it('should return default font when settings do not exist', async () => {
    const error = new Error('Settings not found');

    mockWebsiteSettingsRepository.getByKey.mockRejectedValue(error);

    const result = await useCase.execute();

    expect(result.value).toBe(DEFAULT_FONT);
  });

  it('should return font with correct metadata', async () => {
    const setting = new WebsiteSetting('website-font', 'Playfair Display');

    mockWebsiteSettingsRepository.getByKey.mockResolvedValue(setting);

    const result = await useCase.execute();

    expect(result.value).toBe('Playfair Display');
    expect(result.getMetadata()?.category).toBe('serif');
  });
});
