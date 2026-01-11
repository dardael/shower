import 'reflect-metadata';
import { GetAppointmentModuleEnabled } from '@/application/appointment/AppointmentModuleUseCases';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { WebsiteSetting } from '@/domain/settings/entities/WebsiteSetting';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

describe('GetAppointmentModuleEnabled', () => {
  let mockRepository: jest.Mocked<WebsiteSettingsRepository>;
  let useCase: GetAppointmentModuleEnabled;

  beforeEach(() => {
    mockRepository = {
      getByKey: jest.fn(),
      setByKey: jest.fn(),
      getAll: jest.fn(),
      deleteByKey: jest.fn(),
    } as unknown as jest.Mocked<WebsiteSettingsRepository>;

    useCase = new GetAppointmentModuleEnabled(mockRepository);
  });

  it('should return enabled when repository returns "true"', async () => {
    const setting = new WebsiteSetting(
      VALID_SETTING_KEYS.APPOINTMENT_MODULE_ENABLED,
      'true'
    );
    mockRepository.getByKey.mockResolvedValue(setting);

    const result = await useCase.execute();

    expect(result.enabled).toBe(true);
    expect(result.enabled).toBe(true);
    expect(mockRepository.getByKey).toHaveBeenCalledWith(
      VALID_SETTING_KEYS.APPOINTMENT_MODULE_ENABLED
    );
  });

  it('should return disabled when repository returns "false"', async () => {
    const setting = new WebsiteSetting(
      VALID_SETTING_KEYS.APPOINTMENT_MODULE_ENABLED,
      'false'
    );
    mockRepository.getByKey.mockResolvedValue(setting);

    const result = await useCase.execute();

    expect(result.enabled).toBe(false);
    expect(result.enabled).toBe(false);
  });

  it('should return disabled when repository returns null', async () => {
    mockRepository.getByKey.mockResolvedValue(
      null as unknown as WebsiteSetting
    );

    const result = await useCase.execute();

    expect(result.enabled).toBe(false);
    expect(result.enabled).toBe(false);
  });

  it('should return disabled when repository returns undefined value', async () => {
    const setting = new WebsiteSetting(
      VALID_SETTING_KEYS.APPOINTMENT_MODULE_ENABLED,
      undefined as unknown as string
    );
    mockRepository.getByKey.mockResolvedValue(setting);

    const result = await useCase.execute();

    expect(result.enabled).toBe(false);
  });

  it('should return disabled for any non-"true" string value', async () => {
    const setting = new WebsiteSetting(
      VALID_SETTING_KEYS.APPOINTMENT_MODULE_ENABLED,
      'yes'
    );
    mockRepository.getByKey.mockResolvedValue(setting);

    const result = await useCase.execute();

    expect(result.enabled).toBe(false);
  });
});
