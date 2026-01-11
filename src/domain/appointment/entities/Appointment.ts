import { AppointmentStatus } from '../value-objects/AppointmentStatus';
import { ClientInfo } from '../value-objects/ClientInfo';

interface AppointmentProps {
  id?: string;
  activityId: string;
  activityName: string;
  activityDurationMinutes: number;
  clientInfo: ClientInfo;
  dateTime: Date;
  status: AppointmentStatus;
  version?: number;
  reminderSent?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Appointment {
  private constructor(
    private readonly _id: string | undefined,
    private readonly _activityId: string,
    private readonly _activityName: string,
    private readonly _activityDurationMinutes: number,
    private readonly _clientInfo: ClientInfo,
    private readonly _dateTime: Date,
    private readonly _status: AppointmentStatus,
    private readonly _version: number,
    private readonly _reminderSent: boolean,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date
  ) {}

  get id(): string | undefined {
    return this._id;
  }

  get activityId(): string {
    return this._activityId;
  }

  get activityName(): string {
    return this._activityName;
  }

  get activityDurationMinutes(): number {
    return this._activityDurationMinutes;
  }

  get clientInfo(): ClientInfo {
    return this._clientInfo;
  }

  get dateTime(): Date {
    return this._dateTime;
  }

  get status(): AppointmentStatus {
    return this._status;
  }

  get version(): number {
    return this._version;
  }

  get reminderSent(): boolean {
    return this._reminderSent;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get endDateTime(): Date {
    return new Date(
      this._dateTime.getTime() + this._activityDurationMinutes * 60 * 1000
    );
  }

  static create(props: AppointmentProps): Appointment {
    if (!props.activityId) {
      throw new Error("L'identifiant de l'activité est requis");
    }

    if (!props.activityName.trim()) {
      throw new Error("Le nom de l'activité est requis");
    }

    if (props.activityDurationMinutes <= 0) {
      throw new Error('La durée doit être supérieure à 0 minutes');
    }

    if (
      !props.dateTime ||
      !(props.dateTime instanceof Date) ||
      isNaN(props.dateTime.getTime())
    ) {
      throw new Error('Une date et heure valides sont requises');
    }

    const now = new Date();

    return new Appointment(
      props.id,
      props.activityId,
      props.activityName.trim(),
      props.activityDurationMinutes,
      props.clientInfo,
      props.dateTime,
      props.status || AppointmentStatus.pending(),
      props.version ?? 1,
      props.reminderSent ?? false,
      props.createdAt || now,
      props.updatedAt || now
    );
  }

  withId(id: string): Appointment {
    return new Appointment(
      id,
      this._activityId,
      this._activityName,
      this._activityDurationMinutes,
      this._clientInfo,
      this._dateTime,
      this._status,
      this._version,
      this._reminderSent,
      this._createdAt,
      this._updatedAt
    );
  }

  confirm(): Appointment {
    if (!this._status.canTransitionTo(AppointmentStatus.confirmed())) {
      throw new Error('Ce rendez-vous ne peut pas être confirmé');
    }

    return new Appointment(
      this._id,
      this._activityId,
      this._activityName,
      this._activityDurationMinutes,
      this._clientInfo,
      this._dateTime,
      AppointmentStatus.confirmed(),
      this._version + 1,
      this._reminderSent,
      this._createdAt,
      new Date()
    );
  }

  cancel(): Appointment {
    if (!this._status.canTransitionTo(AppointmentStatus.cancelled())) {
      throw new Error('Ce rendez-vous ne peut pas être annulé');
    }

    return new Appointment(
      this._id,
      this._activityId,
      this._activityName,
      this._activityDurationMinutes,
      this._clientInfo,
      this._dateTime,
      AppointmentStatus.cancelled(),
      this._version + 1,
      this._reminderSent,
      this._createdAt,
      new Date()
    );
  }

  markReminderSent(): Appointment {
    return new Appointment(
      this._id,
      this._activityId,
      this._activityName,
      this._activityDurationMinutes,
      this._clientInfo,
      this._dateTime,
      this._status,
      this._version,
      true,
      this._createdAt,
      new Date()
    );
  }

  overlaps(other: Appointment): boolean {
    return (
      this._dateTime < other.endDateTime && other._dateTime < this.endDateTime
    );
  }

  toObject(): AppointmentProps {
    return {
      id: this._id,
      activityId: this._activityId,
      activityName: this._activityName,
      activityDurationMinutes: this._activityDurationMinutes,
      clientInfo: this._clientInfo,
      dateTime: this._dateTime,
      status: this._status,
      version: this._version,
      reminderSent: this._reminderSent,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
