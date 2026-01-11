import { inject, injectable } from 'tsyringe';
import type { IActivityRepository } from '@/domain/appointment/repositories/IActivityRepository';
import { Activity } from '@/domain/appointment/entities/Activity';
import { RequiredFieldsConfig } from '@/domain/appointment/value-objects/RequiredFieldsConfig';
import { ReminderSettings } from '@/domain/appointment/value-objects/ReminderSettings';

interface CreateActivityInput {
  name: string;
  description?: string;
  durationMinutes: number;
  color: string;
  price: number;
  requiredFields: {
    fields: Array<'name' | 'email' | 'phone' | 'address' | 'custom'>;
    customFieldLabel?: string;
  };
  reminderSettings: {
    enabled: boolean;
    hoursBefore?: number;
  };
  minimumBookingNoticeHours: number;
}

export interface ICreateActivity {
  execute(input: CreateActivityInput): Promise<Activity>;
}

@injectable()
export class CreateActivity implements ICreateActivity {
  constructor(
    @inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository
  ) {}

  async execute(input: CreateActivityInput): Promise<Activity> {
    const requiredFields = RequiredFieldsConfig.create({
      fields: input.requiredFields.fields,
      customFieldLabel: input.requiredFields.customFieldLabel,
    });

    const reminderSettings = input.reminderSettings.enabled
      ? ReminderSettings.withHours(input.reminderSettings.hoursBefore)
      : ReminderSettings.disabled();

    const activity = Activity.create({
      name: input.name,
      description: input.description,
      durationMinutes: input.durationMinutes,
      color: input.color,
      price: input.price,
      requiredFields,
      reminderSettings,
      minimumBookingNoticeHours: input.minimumBookingNoticeHours,
    });

    return this.activityRepository.save(activity);
  }
}

export interface IGetAllActivities {
  execute(): Promise<Activity[]>;
}

@injectable()
export class GetAllActivities implements IGetAllActivities {
  constructor(
    @inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository
  ) {}

  async execute(): Promise<Activity[]> {
    return this.activityRepository.findAll();
  }
}

export interface IGetActivityById {
  execute(id: string): Promise<Activity | null>;
}

@injectable()
export class GetActivityById implements IGetActivityById {
  constructor(
    @inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository
  ) {}

  async execute(id: string): Promise<Activity | null> {
    return this.activityRepository.findById(id);
  }
}

interface UpdateActivityInput {
  id: string;
  name?: string;
  description?: string;
  durationMinutes?: number;
  color?: string;
  price?: number;
  requiredFields?: {
    fields: Array<'name' | 'email' | 'phone' | 'address' | 'custom'>;
    customFieldLabel?: string;
  };
  reminderSettings?: {
    enabled: boolean;
    hoursBefore?: number;
  };
  minimumBookingNoticeHours?: number;
}

export interface IUpdateActivity {
  execute(input: UpdateActivityInput): Promise<Activity>;
}

@injectable()
export class UpdateActivity implements IUpdateActivity {
  constructor(
    @inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository
  ) {}

  async execute(input: UpdateActivityInput): Promise<Activity> {
    const existingActivity = await this.activityRepository.findById(input.id);
    if (!existingActivity) {
      throw new Error('Activité non trouvée');
    }

    const requiredFields = input.requiredFields
      ? RequiredFieldsConfig.create({
          fields: input.requiredFields.fields,
          customFieldLabel: input.requiredFields.customFieldLabel,
        })
      : undefined;

    const reminderSettings = input.reminderSettings
      ? input.reminderSettings.enabled
        ? ReminderSettings.withHours(input.reminderSettings.hoursBefore)
        : ReminderSettings.disabled()
      : undefined;

    const updatedActivity = existingActivity.update({
      name: input.name,
      description: input.description,
      durationMinutes: input.durationMinutes,
      color: input.color,
      price: input.price,
      requiredFields,
      reminderSettings,
      minimumBookingNoticeHours: input.minimumBookingNoticeHours,
    });

    return this.activityRepository.update(updatedActivity);
  }
}

export interface IDeleteActivity {
  execute(id: string): Promise<void>;
}

@injectable()
export class DeleteActivity implements IDeleteActivity {
  constructor(
    @inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository
  ) {}

  async execute(id: string): Promise<void> {
    const existingActivity = await this.activityRepository.findById(id);
    if (!existingActivity) {
      throw new Error('Activité non trouvée');
    }

    await this.activityRepository.delete(id);
  }
}
