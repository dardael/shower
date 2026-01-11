type AppointmentStatusValue = 'pending' | 'confirmed' | 'cancelled';

export class AppointmentStatus {
  private constructor(private readonly _value: AppointmentStatusValue) {}

  get value(): AppointmentStatusValue {
    return this._value;
  }

  static pending(): AppointmentStatus {
    return new AppointmentStatus('pending');
  }

  static confirmed(): AppointmentStatus {
    return new AppointmentStatus('confirmed');
  }

  static cancelled(): AppointmentStatus {
    return new AppointmentStatus('cancelled');
  }

  static fromString(value: string): AppointmentStatus {
    if (value !== 'pending' && value !== 'confirmed' && value !== 'cancelled') {
      throw new Error(`Statut de rendez-vous invalide : ${value}`);
    }
    return new AppointmentStatus(value);
  }

  isPending(): boolean {
    return this._value === 'pending';
  }

  isConfirmed(): boolean {
    return this._value === 'confirmed';
  }

  isCancelled(): boolean {
    return this._value === 'cancelled';
  }

  canTransitionTo(newStatus: AppointmentStatus): boolean {
    if (this.isCancelled()) {
      return false;
    }
    if (this.isPending()) {
      return newStatus.isConfirmed() || newStatus.isCancelled();
    }
    if (this.isConfirmed()) {
      return newStatus.isCancelled();
    }
    return false;
  }

  equals(other: AppointmentStatus): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
