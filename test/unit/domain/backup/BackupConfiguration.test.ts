import { BackupConfiguration } from '@/domain/backup/entities/BackupConfiguration';

describe('BackupConfiguration', () => {
  describe('create', () => {
    it('should create a default configuration when no props provided', () => {
      const config = BackupConfiguration.create();

      expect(config.enabled).toBe(false);
      expect(config.scheduledHour).toBe(3);
      expect(config.retentionCount).toBe(7);
      expect(config.timezone).toBe('Europe/Paris');
      expect(config.lastBackupAt).toBeNull();
    });

    it('should create a configuration with provided props', () => {
      const lastBackupAt = new Date('2025-01-15T02:00:00Z');
      const config = BackupConfiguration.create({
        enabled: true,
        scheduledHour: 14,
        retentionCount: 5,
        timezone: 'America/New_York',
        lastBackupAt,
      });

      expect(config.enabled).toBe(true);
      expect(config.scheduledHour).toBe(14);
      expect(config.retentionCount).toBe(5);
      expect(config.timezone).toBe('America/New_York');
      expect(config.lastBackupAt).toEqual(lastBackupAt);
    });
  });

  describe('scheduledHour validation', () => {
    it('should accept valid hours (0-23)', () => {
      const config0 = BackupConfiguration.create({ scheduledHour: 0 });
      const config23 = BackupConfiguration.create({ scheduledHour: 23 });

      expect(config0.scheduledHour).toBe(0);
      expect(config23.scheduledHour).toBe(23);
    });

    it('should throw for hours below 0', () => {
      expect(() => BackupConfiguration.create({ scheduledHour: -1 })).toThrow(
        'scheduledHour must be an integer between 0 and 23'
      );
    });

    it('should throw for hours above 23', () => {
      expect(() => BackupConfiguration.create({ scheduledHour: 24 })).toThrow(
        'scheduledHour must be an integer between 0 and 23'
      );
    });
  });

  describe('retentionCount validation', () => {
    it('should accept valid retention counts (1-30)', () => {
      const config1 = BackupConfiguration.create({ retentionCount: 1 });
      const config30 = BackupConfiguration.create({ retentionCount: 30 });

      expect(config1.retentionCount).toBe(1);
      expect(config30.retentionCount).toBe(30);
    });

    it('should throw for retention counts below 1', () => {
      expect(() => BackupConfiguration.create({ retentionCount: 0 })).toThrow(
        'retentionCount must be an integer between 1 and 30'
      );
    });

    it('should throw for retention counts above 30', () => {
      expect(() => BackupConfiguration.create({ retentionCount: 31 })).toThrow(
        'retentionCount must be an integer between 1 and 30'
      );
    });
  });

  describe('withEnabled', () => {
    it('should enable the configuration', () => {
      const config = BackupConfiguration.create({ enabled: false });
      const enabledConfig = config.withEnabled(true);

      expect(enabledConfig.enabled).toBe(true);
    });

    it('should disable the configuration', () => {
      const config = BackupConfiguration.create({ enabled: true });
      const disabledConfig = config.withEnabled(false);

      expect(disabledConfig.enabled).toBe(false);
    });
  });

  describe('withScheduledHour', () => {
    it('should update the scheduled hour', () => {
      const config = BackupConfiguration.create({ scheduledHour: 3 });
      const updatedConfig = config.withScheduledHour(14);

      expect(updatedConfig.scheduledHour).toBe(14);
    });
  });

  describe('withRetentionCount', () => {
    it('should update the retention count', () => {
      const config = BackupConfiguration.create({ retentionCount: 7 });
      const updatedConfig = config.withRetentionCount(14);

      expect(updatedConfig.retentionCount).toBe(14);
    });
  });

  describe('withTimezone', () => {
    it('should update the timezone', () => {
      const config = BackupConfiguration.create({ timezone: 'Europe/Paris' });
      const updatedConfig = config.withTimezone('America/New_York');

      expect(updatedConfig.timezone).toBe('America/New_York');
    });
  });

  describe('withLastBackupAt', () => {
    it('should update the last backup timestamp', () => {
      const config = BackupConfiguration.create();
      const newDate = new Date('2025-01-15T02:00:00Z');
      const updatedConfig = config.withLastBackupAt(newDate);

      expect(updatedConfig.lastBackupAt).toEqual(newDate);
    });
  });

  describe('toData', () => {
    it('should return all configuration data', () => {
      const lastBackupAt = new Date('2025-01-15T02:00:00Z');
      const config = BackupConfiguration.create({
        enabled: true,
        scheduledHour: 14,
        retentionCount: 5,
        timezone: 'America/New_York',
        lastBackupAt,
      });

      const data = config.toData();

      expect(data).toEqual({
        enabled: true,
        scheduledHour: 14,
        retentionCount: 5,
        timezone: 'America/New_York',
        lastBackupAt,
      });
    });
  });
});
