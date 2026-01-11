import { FRENCH_DAY_NAMES } from '@/domain/appointment/constants/FrenchLocale';
import { TIME_REGEX } from '@/domain/appointment/constants/TimeValidation';

interface WeeklySlotProps {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export class WeeklySlot {
  private constructor(
    private readonly _dayOfWeek: number,
    private readonly _startTime: string,
    private readonly _endTime: string
  ) {}

  get dayOfWeek(): number {
    return this._dayOfWeek;
  }

  get startTime(): string {
    return this._startTime;
  }

  get endTime(): string {
    return this._endTime;
  }

  static create(props: WeeklySlotProps): WeeklySlot {
    if (props.dayOfWeek < 0 || props.dayOfWeek > 6) {
      throw new Error(
        'Le jour de la semaine doit être entre 0 (dimanche) et 6 (samedi)'
      );
    }

    if (!TIME_REGEX.test(props.startTime) || !TIME_REGEX.test(props.endTime)) {
      throw new Error("Format d'heure invalide (attendu HH:mm)");
    }

    if (props.endTime <= props.startTime) {
      throw new Error("L'heure de fin doit être après l'heure de début");
    }

    return new WeeklySlot(props.dayOfWeek, props.startTime, props.endTime);
  }

  getDurationMinutes(): number {
    const [startHours, startMinutes] = this._startTime.split(':').map(Number);
    const [endHours, endMinutes] = this._endTime.split(':').map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    return endTotalMinutes - startTotalMinutes;
  }

  overlaps(other: WeeklySlot): boolean {
    if (this._dayOfWeek !== other._dayOfWeek) {
      return false;
    }

    return this._startTime < other._endTime && other._startTime < this._endTime;
  }

  getDayName(): string {
    return FRENCH_DAY_NAMES[this._dayOfWeek];
  }

  toObject(): WeeklySlotProps {
    return {
      dayOfWeek: this._dayOfWeek,
      startTime: this._startTime,
      endTime: this._endTime,
    };
  }

  equals(other: WeeklySlot): boolean {
    return (
      this._dayOfWeek === other._dayOfWeek &&
      this._startTime === other._startTime &&
      this._endTime === other._endTime
    );
  }
}
