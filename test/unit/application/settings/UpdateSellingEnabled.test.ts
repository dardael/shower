import 'reflect-metadata';
import { UpdateSellingEnabled } from '@/application/settings/UpdateSellingEnabled';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { SellingEnabled } from '@/domain/settings/value-objects/SellingEnabled';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

describe('UpdateSellingEnabled', () => {
  let mockRepository: jest.Mocked<WebsiteSettingsRepository>;
  let useCase: UpdateSellingEnabled;

  beforeEach(() => {
    mockRepository = {
      getByKey: jest.fn(),
      setByKey: jest.fn(),
      getAll: jest.fn(),
      deleteByKey: jest.fn(),
    } as unknown as jest.Mocked<WebsiteSettingsRepository>;

    useCase = new UpdateSellingEnabled(mockRepository);
  });

  it('should save "true" when selling is enabled', async () => {
    const sellingEnabled = SellingEnabled.enabled();
    mockRepository.setByKey.mockResolvedValue(undefined);

    await useCase.execute(sellingEnabled);

    expect(mockRepository.setByKey).toHaveBeenCalledWith(
      VALID_SETTING_KEYS.SELLING_ENABLED,
      'true'
    );
  });

  it('should save "false" when selling is disabled', async () => {
    const sellingEnabled = SellingEnabled.disabled();
    mockRepository.setByKey.mockResolvedValue(undefined);

    await useCase.execute(sellingEnabled);

    expect(mockRepository.setByKey).toHaveBeenCalledWith(
      VALID_SETTING_KEYS.SELLING_ENABLED,
      'false'
    );
  });

  it('should propagate repository errors', async () => {
    const sellingEnabled = SellingEnabled.enabled();
    const error = new Error('Database error');
    mockRepository.setByKey.mockRejectedValue(error);

    await expect(useCase.execute(sellingEnabled)).rejects.toThrow(
      'Database error'
    );
  });
});
