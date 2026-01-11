import mongoose from 'mongoose';
import { injectable } from 'tsyringe';
import { Appointment } from '@/domain/appointment/entities/Appointment';
import { IAppointmentRepository } from '@/domain/appointment/repositories/IAppointmentRepository';
import { AppointmentStatus } from '@/domain/appointment/value-objects/AppointmentStatus';
import { ClientInfo } from '@/domain/appointment/value-objects/ClientInfo';
import {
  AppointmentModel,
  IAppointmentDocument,
} from '../models/AppointmentModel';

@injectable()
export class MongooseAppointmentRepository implements IAppointmentRepository {
  private toDomain(doc: IAppointmentDocument): Appointment {
    const clientInfo = ClientInfo.create({
      name: doc.clientInfo.name,
      email: doc.clientInfo.email,
      phone: doc.clientInfo.phone,
      address: doc.clientInfo.address,
      customField: doc.clientInfo.customField,
    });

    return Appointment.create({
      id: String(doc._id),
      activityId: String(doc.activityId),
      activityName: doc.activityName,
      activityDurationMinutes: doc.activityDurationMinutes,
      clientInfo,
      dateTime: doc.dateTime,
      status: AppointmentStatus.fromString(doc.status),
      version: doc.version,
      reminderSent: doc.reminderSent,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  private toDocument(appointment: Appointment): Partial<IAppointmentDocument> {
    const clientInfo = appointment.clientInfo.toObject();

    return {
      activityId: new mongoose.Types.ObjectId(appointment.activityId),
      activityName: appointment.activityName,
      activityDurationMinutes: appointment.activityDurationMinutes,
      clientInfo: {
        name: clientInfo.name,
        email: clientInfo.email,
        phone: clientInfo.phone,
        address: clientInfo.address,
        customField: clientInfo.customField,
      },
      dateTime: appointment.dateTime,
      status: appointment.status.value,
      version: appointment.version,
      reminderSent: appointment.reminderSent,
    };
  }

  async findById(id: string): Promise<Appointment | null> {
    const doc = await AppointmentModel.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findAll(): Promise<Appointment[]> {
    const docs = await AppointmentModel.find().sort({ dateTime: -1 }).exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<Appointment[]> {
    const docs = await AppointmentModel.find({
      dateTime: { $gte: startDate, $lte: endDate },
    })
      .sort({ dateTime: 1 })
      .exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  async findByActivityId(activityId: string): Promise<Appointment[]> {
    const docs = await AppointmentModel.find({ activityId })
      .sort({ dateTime: -1 })
      .exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  async findPendingReminders(beforeDate: Date): Promise<Appointment[]> {
    const docs = await AppointmentModel.find({
      reminderSent: false,
      status: { $in: ['pending', 'confirmed'] },
      dateTime: { $lte: beforeDate },
    }).exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  async save(appointment: Appointment): Promise<Appointment> {
    const hasOverlap = await this.hasOverlappingAppointment(
      appointment.dateTime,
      appointment.activityDurationMinutes
    );

    if (hasOverlap) {
      throw new Error('Un rendez-vous existe déjà pour ce créneau horaire');
    }

    const doc = new AppointmentModel(this.toDocument(appointment));
    const saved = await doc.save();
    return this.toDomain(saved);
  }

  async update(appointment: Appointment): Promise<Appointment> {
    if (!appointment.id) {
      throw new Error(
        'Le rendez-vous doit avoir un identifiant pour être mis à jour'
      );
    }

    const updated = await AppointmentModel.findByIdAndUpdate(
      appointment.id,
      this.toDocument(appointment),
      { new: true, runValidators: true }
    ).exec();

    if (!updated) {
      throw new Error('Rendez-vous non trouvé');
    }

    return this.toDomain(updated);
  }

  async updateWithOptimisticLock(
    appointment: Appointment
  ): Promise<Appointment> {
    if (!appointment.id) {
      throw new Error(
        'Le rendez-vous doit avoir un identifiant pour être mis à jour'
      );
    }

    const updated = await AppointmentModel.findOneAndUpdate(
      {
        _id: appointment.id,
        version: appointment.version - 1,
      },
      this.toDocument(appointment),
      { new: true, runValidators: true }
    ).exec();

    if (!updated) {
      throw new Error('Le rendez-vous a été modifié par un autre utilisateur');
    }

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await AppointmentModel.findByIdAndDelete(id).exec();
  }

  async hasOverlappingAppointment(
    dateTime: Date,
    durationMinutes: number,
    excludeId?: string
  ): Promise<boolean> {
    const endTime = new Date(dateTime.getTime() + durationMinutes * 60 * 1000);

    const query: Record<string, unknown> = {
      status: { $ne: 'cancelled' },
      $or: [
        // Le nouveau rendez-vous commence pendant un rendez-vous existant
        {
          dateTime: { $lte: dateTime },
          $expr: {
            $gt: [
              {
                $add: [
                  '$dateTime',
                  { $multiply: ['$activityDurationMinutes', 60000] },
                ],
              },
              dateTime,
            ],
          },
        },
        // Le nouveau rendez-vous se termine pendant un rendez-vous existant
        {
          dateTime: { $lt: endTime },
          $expr: {
            $gte: [
              {
                $add: [
                  '$dateTime',
                  { $multiply: ['$activityDurationMinutes', 60000] },
                ],
              },
              dateTime,
            ],
          },
        },
      ],
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const count = await AppointmentModel.countDocuments(query).exec();
    return count > 0;
  }
}
