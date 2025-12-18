/**
 * Scheduled Restart Configuration Value Object
 * Represents the configuration for scheduled server restarts
 */

export interface ScheduledRestartConfigValue {
  enabled: boolean;
  restartHour: number;
  timezone: string;
  lastRestartAt: string | null;
}

export class ScheduledRestartConfig {
  private static readonly MIN_HOUR = 0;
  private static readonly MAX_HOUR = 23;
  private static readonly DEFAULT_HOUR = 3;
  private static readonly DEFAULT_TIMEZONE = 'UTC';

  private constructor(
    private readonly _enabled: boolean,
    private readonly _restartHour: number,
    private readonly _timezone: string,
    private readonly _lastRestartAt: Date | null
  ) {}

  get enabled(): boolean {
    return this._enabled;
  }

  get restartHour(): number {
    return this._restartHour;
  }

  get timezone(): string {
    return this._timezone;
  }

  get lastRestartAt(): Date | null {
    return this._lastRestartAt;
  }

  static create(value: unknown): ScheduledRestartConfig {
    if (!ScheduledRestartConfig.isValid(value)) {
      return ScheduledRestartConfig.default();
    }
    const config = value as ScheduledRestartConfigValue;
    const lastRestartAt = config.lastRestartAt
      ? new Date(config.lastRestartAt)
      : null;
    return new ScheduledRestartConfig(
      config.enabled,
      config.restartHour,
      config.timezone || ScheduledRestartConfig.DEFAULT_TIMEZONE,
      lastRestartAt
    );
  }

  static default(): ScheduledRestartConfig {
    return new ScheduledRestartConfig(
      false,
      ScheduledRestartConfig.DEFAULT_HOUR,
      ScheduledRestartConfig.DEFAULT_TIMEZONE,
      null
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
      obj.restartHour <= ScheduledRestartConfig.MAX_HOUR &&
      (obj.timezone === undefined ||
        (typeof obj.timezone === 'string' &&
          ScheduledRestartConfig.isValidTimezone(obj.timezone)))
    );
  }

  static isValidTimezone(timezone: string): boolean {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone });
      return true;
    } catch {
      return false;
    }
  }

  toValue(): ScheduledRestartConfigValue {
    return {
      enabled: this._enabled,
      restartHour: this._restartHour,
      timezone: this._timezone,
      lastRestartAt: this._lastRestartAt?.toISOString() ?? null,
    };
  }

  withEnabled(enabled: boolean): ScheduledRestartConfig {
    return new ScheduledRestartConfig(
      enabled,
      this._restartHour,
      this._timezone,
      this._lastRestartAt
    );
  }

  withRestartHour(hour: number): ScheduledRestartConfig {
    if (
      hour < ScheduledRestartConfig.MIN_HOUR ||
      hour > ScheduledRestartConfig.MAX_HOUR
    ) {
      return this;
    }
    return new ScheduledRestartConfig(
      this._enabled,
      hour,
      this._timezone,
      this._lastRestartAt
    );
  }

  withTimezone(timezone: string): ScheduledRestartConfig {
    return new ScheduledRestartConfig(
      this._enabled,
      this._restartHour,
      timezone,
      this._lastRestartAt
    );
  }

  withLastRestartAt(date: Date): ScheduledRestartConfig {
    return new ScheduledRestartConfig(
      this._enabled,
      this._restartHour,
      this._timezone,
      date
    );
  }

  equals(other: ScheduledRestartConfig): boolean {
    return (
      this._enabled === other._enabled &&
      this._restartHour === other._restartHour &&
      this._timezone === other._timezone
    );
  }

  toString(): string {
    return `ScheduledRestartConfig(enabled=${this._enabled}, hour=${this._restartHour}, timezone=${this._timezone}, lastRestartAt=${this._lastRestartAt?.toISOString() ?? 'never'})`;
  }
}
