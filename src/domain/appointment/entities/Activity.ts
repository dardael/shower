import { RequiredFieldsConfig } from '../value-objects/RequiredFieldsConfig';
import { ReminderSettings } from '../value-objects/ReminderSettings';

interface ActivityProps {
  id?: string;
  name: string;
  description?: string;
  durationMinutes: number;
  color: string;
  price: number;
  requiredFields: RequiredFieldsConfig;
  reminderSettings: ReminderSettings;
  minimumBookingNoticeHours: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export class Activity {
  private constructor(
    private readonly _id: string | undefined,
    private readonly _name: string,
    private readonly _description: string | undefined,
    private readonly _durationMinutes: number,
    private readonly _color: string,
    private readonly _price: number,
    private readonly _requiredFields: RequiredFieldsConfig,
    private readonly _reminderSettings: ReminderSettings,
    private readonly _minimumBookingNoticeHours: number,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date
  ) {}

  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }

  get durationMinutes(): number {
    return this._durationMinutes;
  }

  get color(): string {
    return this._color;
  }

  get price(): number {
    return this._price;
  }

  get requiredFields(): RequiredFieldsConfig {
    return this._requiredFields;
  }

  get reminderSettings(): ReminderSettings {
    return this._reminderSettings;
  }

  get minimumBookingNoticeHours(): number {
    return this._minimumBookingNoticeHours;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  static create(props: ActivityProps): Activity {
    const trimmedName = props.name?.trim();
    if (!trimmedName) {
      throw new Error("Le nom de l'activité est requis");
    }

    if (props.durationMinutes <= 0) {
      throw new Error('La durée doit être supérieure à 0 minutes');
    }

    if (!HEX_COLOR_REGEX.test(props.color)) {
      throw new Error('Format de couleur invalide (attendu #RRGGBB ou #RGB)');
    }

    if (props.price < 0) {
      throw new Error('Le prix ne peut pas être négatif');
    }

    if (props.minimumBookingNoticeHours < 0) {
      throw new Error(
        'Le délai minimum de réservation ne peut pas être négatif'
      );
    }

    const now = new Date();

    return new Activity(
      props.id,
      trimmedName,
      props.description?.trim() || undefined,
      props.durationMinutes,
      props.color.toLowerCase(),
      props.price,
      props.requiredFields,
      props.reminderSettings,
      props.minimumBookingNoticeHours,
      props.createdAt || now,
      props.updatedAt || now
    );
  }

  withId(id: string): Activity {
    return new Activity(
      id,
      this._name,
      this._description,
      this._durationMinutes,
      this._color,
      this._price,
      this._requiredFields,
      this._reminderSettings,
      this._minimumBookingNoticeHours,
      this._createdAt,
      this._updatedAt
    );
  }

  update(props: Partial<Omit<ActivityProps, 'id' | 'createdAt'>>): Activity {
    return new Activity(
      this._id,
      props.name?.trim() || this._name,
      props.description !== undefined
        ? props.description?.trim() || undefined
        : this._description,
      props.durationMinutes ?? this._durationMinutes,
      props.color?.toLowerCase() || this._color,
      props.price ?? this._price,
      props.requiredFields ?? this._requiredFields,
      props.reminderSettings ?? this._reminderSettings,
      props.minimumBookingNoticeHours ?? this._minimumBookingNoticeHours,
      this._createdAt,
      new Date()
    );
  }

  toObject(): ActivityProps {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      durationMinutes: this._durationMinutes,
      color: this._color,
      price: this._price,
      requiredFields: this._requiredFields,
      reminderSettings: this._reminderSettings,
      minimumBookingNoticeHours: this._minimumBookingNoticeHours,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
