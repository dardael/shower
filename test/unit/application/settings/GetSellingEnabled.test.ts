import 'reflect-metadata';
import { GetSellingEnabled } from '@/application/settings/GetSellingEnabled';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { WebsiteSetting } from '@/domain/settings/entities/WebsiteSetting';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

describe('GetSellingEnabled', () => {
  let mockRepository: jest.Mocked<WebsiteSettingsRepository>;
  let useCase: GetSellingEnabled;

  beforeEach(() => {
    mockRepository = {
      getByKey: jest.fn(),
      setByKey: jest.fn(),
      getAll: jest.fn(),
      deleteByKey: jest.fn(),
    } as unknown as jest.Mocked<WebsiteSettingsRepository>;

    useCase = new GetSellingEnabled(mockRepository);
  });

  it('should return enabled when repository returns "true"', async () => {
    const setting = new WebsiteSetting(
      VALID_SETTING_KEYS.SELLING_ENABLED,
      'true'
    );
    mockRepository.getByKey.mockResolvedValue(setting);

    const result = await useCase.execute();

    expect(result.value).toBe(true);
    expect(result.isEnabled()).toBe(true);
    expect(mockRepository.getByKey).toHaveBeenCalledWith(
      VALID_SETTING_KEYS.SELLING_ENABLED
    );
  });

  it('should return disabled when repository returns "false"', async () => {
    const setting = new WebsiteSetting(
      VALID_SETTING_KEYS.SELLING_ENABLED,
      'false'
    );
    mockRepository.getByKey.mockResolvedValue(setting);

    const result = await useCase.execute();

    expect(result.value).toBe(false);
    expect(result.isDisabled()).toBe(true);
  });

  it('should return disabled when repository returns null', async () => {
    mockRepository.getByKey.mockResolvedValue(
      null as unknown as WebsiteSetting
    );

    const result = await useCase.execute();

    expect(result.value).toBe(false);
    expect(result.isDisabled()).toBe(true);
  });

  it('should return disabled when repository returns undefined value', async () => {
    const setting = new WebsiteSetting(
      VALID_SETTING_KEYS.SELLING_ENABLED,
      undefined as unknown as string
    );
    mockRepository.getByKey.mockResolvedValue(setting);

    const result = await useCase.execute();

    expect(result.value).toBe(false);
  });
});
