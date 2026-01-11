interface AvailabilityExceptionProps {
  date: Date;
  reason?: string;
}

export class AvailabilityException {
  private constructor(
    private readonly _date: Date,
    private readonly _reason?: string
  ) {}

  get date(): Date {
    return this._date;
  }

  get reason(): string | undefined {
    return this._reason;
  }

  static create(props: AvailabilityExceptionProps): AvailabilityException {
    if (
      !props.date ||
      !(props.date instanceof Date) ||
      isNaN(props.date.getTime())
    ) {
      throw new Error('Une date valide est requise');
    }

    return new AvailabilityException(
      props.date,
      props.reason?.trim() || undefined
    );
  }

  isOnDate(date: Date): boolean {
    return (
      this._date.getFullYear() === date.getFullYear() &&
      this._date.getMonth() === date.getMonth() &&
      this._date.getDate() === date.getDate()
    );
  }

  toObject(): { date: Date; reason?: string } {
    return {
      date: this._date,
      reason: this._reason,
    };
  }

  equals(other: AvailabilityException): boolean {
    return this.isOnDate(other._date) && this._reason === other._reason;
  }
}
