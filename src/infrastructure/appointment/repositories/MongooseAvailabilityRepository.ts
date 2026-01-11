import { injectable } from 'tsyringe';
import { Availability } from '@/domain/appointment/entities/Availability';
import { IAvailabilityRepository } from '@/domain/appointment/repositories/IAvailabilityRepository';
import { WeeklySlot } from '@/domain/appointment/value-objects/WeeklySlot';
import { AvailabilityException } from '@/domain/appointment/value-objects/AvailabilityException';
import {
  AvailabilityModel,
  IAvailabilityDocument,
} from '../models/AvailabilityModel';

@injectable()
export class MongooseAvailabilityRepository implements IAvailabilityRepository {
  private toDomain(doc: IAvailabilityDocument): Availability {
    const weeklySlots = doc.weeklySlots.map((slot) =>
      WeeklySlot.create({
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
      })
    );

    const exceptions = doc.exceptions.map((exc) =>
      AvailabilityException.create({
        date: exc.date,
        reason: exc.reason,
      })
    );

    return Availability.create({
      id: String(doc._id),
      weeklySlots,
      exceptions,
      updatedAt: doc.updatedAt,
    });
  }

  private toDocument(
    availability: Availability
  ): Partial<IAvailabilityDocument> {
    return {
      weeklySlots: availability.weeklySlots.map((slot) => slot.toObject()),
      exceptions: availability.exceptions.map((exc) => exc.toObject()),
    };
  }

  async find(): Promise<Availability | null> {
    const doc = await AvailabilityModel.findOne().exec();
    return doc ? this.toDomain(doc) : null;
  }

  async save(availability: Availability): Promise<Availability> {
    const doc = new AvailabilityModel(this.toDocument(availability));
    const saved = await doc.save();
    return this.toDomain(saved);
  }

  async update(availability: Availability): Promise<Availability> {
    // Use findOneAndUpdate with upsert to make it atomic
    // This handles both create and update cases atomically
    const filter = availability.id ? { _id: availability.id } : {};

    const updated = await AvailabilityModel.findOneAndUpdate(
      filter,
      this.toDocument(availability),
      {
        new: true,
        runValidators: true,
        upsert: true,
      }
    ).exec();

    if (!updated) {
      throw new Error('Erreur lors de la mise à jour de la disponibilité');
    }

    return this.toDomain(updated);
  }
}
