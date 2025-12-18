/**
 * Scheduled Restart Configuration Value Object
 * Represents the configuration for scheduled server restarts
 */

export interface ScheduledRestartConfigValue {
  enabled: boolean;
  restartHour: number;
}

export class ScheduledRestartConfig {
  private static readonly MIN_HOUR = 0;
  private static readonly MAX_HOUR = 23;
  private static readonly DEFAULT_HOUR = 3;

  private constructor(
    private readonly _enabled: boolean,
    private readonly _restartHour: number
  ) {}

  get enabled(): boolean {
    return this._enabled;
  }

  get restartHour(): number {
    return this._restartHour;
  }

  static create(value: unknown): ScheduledRestartConfig {
    if (!ScheduledRestartConfig.isValid(value)) {
      return ScheduledRestartConfig.default();
    }
    const config = value as ScheduledRestartConfigValue;
    return new ScheduledRestartConfig(config.enabled, config.restartHour);
  }

  static default(): ScheduledRestartConfig {
    return new ScheduledRestartConfig(
      false,
      ScheduledRestartConfig.DEFAULT_HOUR
    );
  }

  static isValid(value: unknown): value is ScheduledRestartConfigValue {
    if (typeof value !== 'object' || value === null) return false;
    const obj = value as Record<string, unknown>;
    return (
      typeof obj.enabled === 'boolean' &&
      typeof obj.restartHour === 'number' &&
      Number.isInteger(obj.restartHour) &&
      obj.restartHour >= ScheduledRestartConfig.MIN_HOUR &&
      obj.restartHour <= ScheduledRestartConfig.MAX_HOUR
    );
  }

  toValue(): ScheduledRestartConfigValue {
    return {
      enabled: this._enabled,
      restartHour: this._restartHour,
    };
  }

  withEnabled(enabled: boolean): ScheduledRestartConfig {
    return new ScheduledRestartConfig(enabled, this._restartHour);
  }

  withRestartHour(hour: number): ScheduledRestartConfig {
    if (
      hour < ScheduledRestartConfig.MIN_HOUR ||
      hour > ScheduledRestartConfig.MAX_HOUR
    ) {
      return this;
    }
    return new ScheduledRestartConfig(this._enabled, hour);
  }

  equals(other: ScheduledRestartConfig): boolean {
    return (
      this._enabled === other._enabled &&
      this._restartHour === other._restartHour
    );
  }

  toString(): string {
    return `ScheduledRestartConfig(enabled=${this._enabled}, hour=${this._restartHour})`;
  }
}
