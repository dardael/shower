export class AppointmentModuleEnabled {
  private constructor(private readonly _enabled: boolean) {}

  get enabled(): boolean {
    return this._enabled;
  }

  static create(enabled: boolean): AppointmentModuleEnabled {
    return new AppointmentModuleEnabled(enabled);
  }

  static enabled(): AppointmentModuleEnabled {
    return new AppointmentModuleEnabled(true);
  }

  static disabled(): AppointmentModuleEnabled {
    return new AppointmentModuleEnabled(false);
  }

  static fromString(value: string): AppointmentModuleEnabled {
    return new AppointmentModuleEnabled(value === 'true');
  }

  toString(): string {
    return this._enabled ? 'true' : 'false';
  }

  equals(other: AppointmentModuleEnabled): boolean {
    return this._enabled === other._enabled;
  }
}
