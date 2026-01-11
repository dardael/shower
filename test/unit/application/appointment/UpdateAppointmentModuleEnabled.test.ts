import 'reflect-metadata';
import { UpdateAppointmentModuleEnabled } from '@/application/appointment/AppointmentModuleUseCases';
import type { WebsiteSettingsRepository } from '@/domain/settings/repositories/WebsiteSettingsRepository';
import { AppointmentModuleEnabled } from '@/domain/appointment/value-objects/AppointmentModuleEnabled';
import { VALID_SETTING_KEYS } from '@/domain/settings/constants/SettingKeys';

describe('UpdateAppointmentModuleEnabled', () => {
  let mockRepository: jest.Mocked<WebsiteSettingsRepository>;
  let useCase: UpdateAppointmentModuleEnabled;

  beforeEach(() => {
    mockRepository = {
      getByKey: jest.fn(),
      setByKey: jest.fn(),
      getAll: jest.fn(),
      deleteByKey: jest.fn(),
    } as unknown as jest.Mocked<WebsiteSettingsRepository>;

    useCase = new UpdateAppointmentModuleEnabled(mockRepository);
  });

  it('should save enabled state to repository', async () => {
    const enabled = AppointmentModuleEnabled.enabled();
    mockRepository.setByKey.mockResolvedValue(undefined);

    await useCase.execute(enabled);

    expect(mockRepository.setByKey).toHaveBeenCalledWith(
      VALID_SETTING_KEYS.APPOINTMENT_MODULE_ENABLED,
      'true'
    );
  });

  it('should save disabled state to repository', async () => {
    const disabled = AppointmentModuleEnabled.disabled();
    mockRepository.setByKey.mockResolvedValue(undefined);

    await useCase.execute(disabled);

    expect(mockRepository.setByKey).toHaveBeenCalledWith(
      VALID_SETTING_KEYS.APPOINTMENT_MODULE_ENABLED,
      'false'
    );
  });

  it('should handle repository errors', async () => {
    const enabled = AppointmentModuleEnabled.enabled();
    mockRepository.setByKey.mockRejectedValue(
      new Error('Erreur de base de données')
    );

    await expect(useCase.execute(enabled)).rejects.toThrow(
      'Erreur de base de données'
    );
  });

  it('should save value created from boolean', async () => {
    const enabled = AppointmentModuleEnabled.create(true);
    mockRepository.setByKey.mockResolvedValue(undefined);

    await useCase.execute(enabled);

    expect(mockRepository.setByKey).toHaveBeenCalledWith(
      VALID_SETTING_KEYS.APPOINTMENT_MODULE_ENABLED,
      'true'
    );
  });
});
