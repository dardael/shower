/**
 * BackupConfiguration entity
 * Represents the backup scheduling settings for the application.
 */
export interface BackupConfigurationData {
  enabled: boolean;
  scheduledHour: number;
  retentionCount: number;
  timezone: string;
  lastBackupAt: Date | null;
}

export class BackupConfiguration {
  private readonly _enabled: boolean;
  private readonly _scheduledHour: number;
  private readonly _retentionCount: number;
  private readonly _timezone: string;
  private readonly _lastBackupAt: Date | null;

  private constructor(data: BackupConfigurationData) {
    this._enabled = data.enabled;
    this._scheduledHour = data.scheduledHour;
    this._retentionCount = data.retentionCount;
    this._timezone = data.timezone;
    this._lastBackupAt = data.lastBackupAt;
  }

  static create(
    data: Partial<BackupConfigurationData> = {}
  ): BackupConfiguration {
    const scheduledHour = data.scheduledHour ?? 3;
    const retentionCount = data.retentionCount ?? 7;

    BackupConfiguration.validateScheduledHour(scheduledHour);
    BackupConfiguration.validateRetentionCount(retentionCount);

    return new BackupConfiguration({
      enabled: data.enabled ?? false,
      scheduledHour,
      retentionCount,
      timezone: data.timezone ?? 'Europe/Paris',
      lastBackupAt: data.lastBackupAt ?? null,
    });
  }

  private static validateScheduledHour(hour: number): void {
    if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
      throw new Error('scheduledHour must be an integer between 0 and 23');
    }
  }

  private static validateRetentionCount(count: number): void {
    if (!Number.isInteger(count) || count < 1 || count > 30) {
      throw new Error('retentionCount must be an integer between 1 and 30');
    }
  }

  get enabled(): boolean {
    return this._enabled;
  }

  get scheduledHour(): number {
    return this._scheduledHour;
  }

  get retentionCount(): number {
    return this._retentionCount;
  }

  get timezone(): string {
    return this._timezone;
  }

  get lastBackupAt(): Date | null {
    return this._lastBackupAt;
  }

  withEnabled(enabled: boolean): BackupConfiguration {
    return BackupConfiguration.create({
      ...this.toData(),
      enabled,
    });
  }

  withScheduledHour(scheduledHour: number): BackupConfiguration {
    return BackupConfiguration.create({
      ...this.toData(),
      scheduledHour,
    });
  }

  withRetentionCount(retentionCount: number): BackupConfiguration {
    return BackupConfiguration.create({
      ...this.toData(),
      retentionCount,
    });
  }

  withTimezone(timezone: string): BackupConfiguration {
    return BackupConfiguration.create({
      ...this.toData(),
      timezone,
    });
  }

  withLastBackupAt(lastBackupAt: Date | null): BackupConfiguration {
    return BackupConfiguration.create({
      ...this.toData(),
      lastBackupAt,
    });
  }

  toData(): BackupConfigurationData {
    return {
      enabled: this._enabled,
      scheduledHour: this._scheduledHour,
      retentionCount: this._retentionCount,
      timezone: this._timezone,
      lastBackupAt: this._lastBackupAt,
    };
  }
}
