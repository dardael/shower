import { WeeklySlot } from '../value-objects/WeeklySlot';
import { AvailabilityException } from '../value-objects/AvailabilityException';

interface AvailabilityProps {
  id?: string;
  weeklySlots: WeeklySlot[];
  exceptions: AvailabilityException[];
  updatedAt?: Date;
}

export class Availability {
  private constructor(
    private readonly _id: string | undefined,
    private readonly _weeklySlots: WeeklySlot[],
    private readonly _exceptions: AvailabilityException[],
    private readonly _updatedAt: Date
  ) {}

  get id(): string | undefined {
    return this._id;
  }

  get weeklySlots(): readonly WeeklySlot[] {
    return this._weeklySlots;
  }

  get exceptions(): readonly AvailabilityException[] {
    return this._exceptions;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  static create(props: AvailabilityProps): Availability {
    return new Availability(
      props.id,
      props.weeklySlots || [],
      props.exceptions || [],
      props.updatedAt || new Date()
    );
  }

  static empty(): Availability {
    return new Availability(undefined, [], [], new Date());
  }

  withId(id: string): Availability {
    return new Availability(
      id,
      this._weeklySlots,
      this._exceptions,
      this._updatedAt
    );
  }

  addWeeklySlot(slot: WeeklySlot): Availability {
    const hasOverlap = this._weeklySlots.some((existing) =>
      existing.overlaps(slot)
    );
    if (hasOverlap) {
      throw new Error('Ce créneau chevauche un créneau existant');
    }

    return new Availability(
      this._id,
      [...this._weeklySlots, slot],
      this._exceptions,
      new Date()
    );
  }

  removeWeeklySlot(slot: WeeklySlot): Availability {
    const filtered = this._weeklySlots.filter((s) => !s.equals(slot));
    return new Availability(this._id, filtered, this._exceptions, new Date());
  }

  addException(exception: AvailabilityException): Availability {
    const hasDuplicate = this._exceptions.some((e) =>
      e.isOnDate(exception.date)
    );
    if (hasDuplicate) {
      throw new Error('Une exception existe déjà pour cette date');
    }

    return new Availability(
      this._id,
      this._weeklySlots,
      [...this._exceptions, exception],
      new Date()
    );
  }

  removeException(date: Date): Availability {
    const filtered = this._exceptions.filter((e) => !e.isOnDate(date));
    return new Availability(this._id, this._weeklySlots, filtered, new Date());
  }

  isDateExcluded(date: Date): boolean {
    return this._exceptions.some((e) => e.isOnDate(date));
  }

  getSlotsForDay(dayOfWeek: number): WeeklySlot[] {
    return this._weeklySlots.filter((s) => s.dayOfWeek === dayOfWeek);
  }

  update(props: {
    weeklySlots?: WeeklySlot[];
    exceptions?: AvailabilityException[];
  }): Availability {
    return new Availability(
      this._id,
      props.weeklySlots ?? this._weeklySlots,
      props.exceptions ?? this._exceptions,
      new Date()
    );
  }

  toObject(): AvailabilityProps {
    return {
      id: this._id,
      weeklySlots: this._weeklySlots,
      exceptions: this._exceptions,
      updatedAt: this._updatedAt,
    };
  }
}
