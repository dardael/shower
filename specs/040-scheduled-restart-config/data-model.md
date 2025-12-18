# Data Model: Scheduled Restart Configuration

**Feature**: 001-scheduled-restart-config  
**Date**: 2025-12-17

## Entities

### ScheduledRestartConfig (Value Object)

Represents the configuration for scheduled server restarts.

| Field       | Type    | Constraints    | Description                                            |
| ----------- | ------- | -------------- | ------------------------------------------------------ |
| enabled     | boolean | Required       | Whether scheduled restarts are enabled                 |
| restartHour | number  | 0-23, Required | Hour of day (24-hour format) when restart should occur |

**Validation Rules**:

- `enabled` must be a boolean value
- `restartHour` must be an integer between 0 and 23 (inclusive)
- Default state: `{ enabled: false, restartHour: 3 }` (disabled, default to 3 AM)

**State Transitions**:

```
[Not Configured] --configure--> [Disabled]
[Disabled] --enable--> [Enabled]
[Enabled] --disable--> [Disabled]
[Enabled/Disabled] --update hour--> [Enabled/Disabled with new hour]
```

## Storage

### MongoDB Setting Entry

Uses existing `WebsiteSetting` model with key-value pattern.

| Key                 | Value Type  | Example                                 |
| ------------------- | ----------- | --------------------------------------- |
| `scheduled-restart` | JSON object | `{ "enabled": true, "restartHour": 3 }` |

**Integration with Existing Infrastructure**:

- Setting key added to `VALID_SETTING_KEYS` constant
- Stored via `MongooseWebsiteSettingsRepository.setByKey()`
- Retrieved via `MongooseWebsiteSettingsRepository.getByKey()`

## Domain Value Object

```typescript
// src/domain/config/value-objects/ScheduledRestartConfig.ts

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

  get enabled(): boolean {
    return this._enabled;
  }

  get restartHour(): number {
    return this._restartHour;
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
}
```

## Relationships

```
WebsiteSetting (existing)
    └── key: 'scheduled-restart'
    └── value: ScheduledRestartConfigValue
            ├── enabled: boolean
            └── restartHour: number (0-23)
```

## Export/Import Integration

The scheduled restart configuration integrates with the existing configuration export/import system:

- **Export**: Included in settings export bundle
- **Import**: Restored from settings import bundle
- **Version**: Export file version incremented on config changes
