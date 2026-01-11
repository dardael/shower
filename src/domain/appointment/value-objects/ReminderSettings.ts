import { REMINDER_SETTINGS } from '@/domain/appointment/constants';

interface ReminderSettingsProps {
  enabled: boolean;
  hoursBefore?: number;
}

export class ReminderSettings {
  private constructor(
    private readonly _enabled: boolean,
    private readonly _hoursBefore?: number
  ) {}

  get enabled(): boolean {
    return this._enabled;
  }

  get hoursBefore(): number | undefined {
    return this._hoursBefore;
  }

  static create(props: ReminderSettingsProps): ReminderSettings {
    if (props.enabled && (!props.hoursBefore || props.hoursBefore <= 0)) {
      throw new Error(
        "Le nombre d'heures avant le rappel doit être supérieur à 0"
      );
    }

    return new ReminderSettings(
      props.enabled,
      props.enabled ? props.hoursBefore : undefined
    );
  }

  static disabled(): ReminderSettings {
    return new ReminderSettings(false);
  }

  static withHours(hours?: number): ReminderSettings {
    return ReminderSettings.create({
      enabled: true,
      hoursBefore: hours ?? REMINDER_SETTINGS.DEFAULT_HOURS_BEFORE,
    });
  }

  toObject(): ReminderSettingsProps {
    return {
      enabled: this._enabled,
      hoursBefore: this._hoursBefore,
    };
  }

  equals(other: ReminderSettings): boolean {
    return (
      this._enabled === other._enabled &&
      this._hoursBefore === other._hoursBefore
    );
  }
}
