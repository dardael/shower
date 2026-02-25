const TIME_FORMAT_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

interface AvailabilityExceptionProps {
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

export class AvailabilityException {
  private constructor(
    private readonly _startDate: Date,
    private readonly _endDate: Date,
    private readonly _startTime: string | undefined,
    private readonly _endTime: string | undefined,
    private readonly _reason: string | undefined
  ) {}

  get startDate(): Date {
    return this._startDate;
  }

  get endDate(): Date {
    return this._endDate;
  }

  get startTime(): string | undefined {
    return this._startTime;
  }

  get endTime(): string | undefined {
    return this._endTime;
  }

  get reason(): string | undefined {
    return this._reason;
  }

  get isAllDay(): boolean {
    return !this._startTime && !this._endTime;
  }

  static create(props: AvailabilityExceptionProps): AvailabilityException {
    if (
      !props.startDate ||
      !(props.startDate instanceof Date) ||
      isNaN(props.startDate.getTime())
    ) {
      throw new Error('Une date de début valide est requise');
    }

    if (
      !props.endDate ||
      !(props.endDate instanceof Date) ||
      isNaN(props.endDate.getTime())
    ) {
      throw new Error('Une date de fin valide est requise');
    }

    const startDay = AvailabilityException.toDateOnly(props.startDate);
    const endDay = AvailabilityException.toDateOnly(props.endDate);

    if (endDay < startDay) {
      throw new Error('La date de fin doit être après la date de début');
    }

    const hasStartTime = !!props.startTime;
    const hasEndTime = !!props.endTime;

    if (hasStartTime !== hasEndTime) {
      throw new Error(
        "L'heure de début et l'heure de fin doivent être fournies ensemble"
      );
    }

    if (hasStartTime && hasEndTime) {
      if (!TIME_FORMAT_REGEX.test(props.startTime!)) {
        throw new Error("Le format de l'heure de début est invalide (HH:MM)");
      }

      if (!TIME_FORMAT_REGEX.test(props.endTime!)) {
        throw new Error("Le format de l'heure de fin est invalide (HH:MM)");
      }

      if (props.endTime! <= props.startTime!) {
        throw new Error("L'heure de fin doit être après l'heure de début");
      }
    }

    return new AvailabilityException(
      props.startDate,
      props.endDate,
      props.startTime || undefined,
      props.endTime || undefined,
      props.reason?.trim() || undefined
    );
  }

  coversDate(date: Date): boolean {
    const day = AvailabilityException.toDateOnly(date);
    const start = AvailabilityException.toDateOnly(this._startDate);
    const end = AvailabilityException.toDateOnly(this._endDate);
    return day >= start && day <= end;
  }

  overlapsWithInterval(
    date: Date,
    startTime: string,
    endTime: string
  ): boolean {
    if (!this.coversDate(date)) {
      return false;
    }

    if (this.isAllDay) {
      return true;
    }

    const day = AvailabilityException.toDateOnly(date);
    const startDay = AvailabilityException.toDateOnly(this._startDate);
    const endDay = AvailabilityException.toDateOnly(this._endDate);

    const isStartDay = day === startDay;
    const isEndDay = day === endDay;

    if (isStartDay && isEndDay) {
      // Plage sur un seul jour : bloqué de startTime à endTime
      return this._startTime! < endTime && startTime < this._endTime!;
    }

    if (isStartDay) {
      // Premier jour : bloqué à partir de startTime jusqu'à fin de journée
      return endTime > this._startTime!;
    }

    if (isEndDay) {
      // Dernier jour : bloqué depuis début de journée jusqu'à endTime
      return startTime < this._endTime!;
    }

    // Jours intermédiaires : entièrement bloqués
    return true;
  }

  private static toDateOnly(date: Date): number {
    return (
      date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
    );
  }

  toObject(): {
    startDate: Date;
    endDate: Date;
    startTime?: string;
    endTime?: string;
    reason?: string;
  } {
    return {
      startDate: this._startDate,
      endDate: this._endDate,
      startTime: this._startTime,
      endTime: this._endTime,
      reason: this._reason,
    };
  }
}
