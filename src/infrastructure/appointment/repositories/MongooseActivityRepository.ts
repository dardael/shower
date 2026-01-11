import { injectable } from 'tsyringe';
import { Activity } from '@/domain/appointment/entities/Activity';
import { IActivityRepository } from '@/domain/appointment/repositories/IActivityRepository';
import { RequiredFieldsConfig } from '@/domain/appointment/value-objects/RequiredFieldsConfig';
import { ReminderSettings } from '@/domain/appointment/value-objects/ReminderSettings';
import { ActivityModel, IActivityDocument } from '../models/ActivityModel';

@injectable()
export class MongooseActivityRepository implements IActivityRepository {
  private readonly validFields = new Set([
    'name',
    'email',
    'phone',
    'address',
    'custom',
  ]);

  private validateFieldType(
    field: string
  ): field is 'name' | 'email' | 'phone' | 'address' | 'custom' {
    return this.validFields.has(field);
  }

  private toDomain(doc: IActivityDocument): Activity {
    const validatedFields = doc.requiredFields.fields.filter((field) =>
      this.validateFieldType(field)
    ) as Array<'name' | 'email' | 'phone' | 'address' | 'custom'>;

    const requiredFields = RequiredFieldsConfig.create({
      fields: validatedFields,
      customFieldLabel: doc.requiredFields.customFieldLabel,
    });

    const reminderSettings = doc.reminderSettings.enabled
      ? ReminderSettings.withHours(doc.reminderSettings.hoursBefore || 24)
      : ReminderSettings.disabled();

    return Activity.create({
      id: String(doc._id),
      name: doc.name,
      description: doc.description,
      durationMinutes: doc.durationMinutes,
      color: doc.color,
      price: doc.price,
      requiredFields,
      reminderSettings,
      minimumBookingNoticeHours: doc.minimumBookingNoticeHours,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  private toDocument(activity: Activity): Partial<IActivityDocument> {
    const requiredFields = activity.requiredFields.toObject();
    const reminderSettings = activity.reminderSettings.toObject();

    return {
      name: activity.name,
      description: activity.description,
      durationMinutes: activity.durationMinutes,
      color: activity.color,
      price: activity.price,
      requiredFields: {
        fields: requiredFields.fields,
        customFieldLabel: requiredFields.customFieldLabel,
      },
      reminderSettings: {
        enabled: reminderSettings.enabled,
        hoursBefore: reminderSettings.hoursBefore,
      },
      minimumBookingNoticeHours: activity.minimumBookingNoticeHours,
    };
  }

  async findById(id: string): Promise<Activity | null> {
    const doc = await ActivityModel.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findAll(): Promise<Activity[]> {
    const docs = await ActivityModel.find().sort({ name: 1 }).exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  async save(activity: Activity): Promise<Activity> {
    const doc = new ActivityModel(this.toDocument(activity));
    const saved = await doc.save();
    return this.toDomain(saved);
  }

  async update(activity: Activity): Promise<Activity> {
    if (!activity.id) {
      throw new Error(
        "L'activité doit avoir un identifiant pour être mise à jour"
      );
    }

    const updated = await ActivityModel.findByIdAndUpdate(
      activity.id,
      this.toDocument(activity),
      { new: true, runValidators: true }
    ).exec();

    if (!updated) {
      throw new Error('Activité non trouvée');
    }

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await ActivityModel.findByIdAndDelete(id).exec();
  }
}
