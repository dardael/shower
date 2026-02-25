import mongoose, { Schema, Document, Model } from 'mongoose';
import { TIME_REGEX, AVAILABILITY_CONSTANTS } from '../constants';

interface IWeeklySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface IException {
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

export interface IAvailabilityDocument extends Document {
  weeklySlots: IWeeklySlot[];
  exceptions: IException[];
  singleton?: number;
  updatedAt: Date;
}

const WeeklySlotSchema = new Schema<IWeeklySlot>(
  {
    dayOfWeek: {
      type: Number,
      required: true,
      min: AVAILABILITY_CONSTANTS.DAY_OF_WEEK_MIN,
      max: AVAILABILITY_CONSTANTS.DAY_OF_WEEK_MAX,
    },
    startTime: {
      type: String,
      required: true,
      match: TIME_REGEX,
    },
    endTime: {
      type: String,
      required: true,
      match: TIME_REGEX,
    },
  },
  { _id: false }
);

const ExceptionSchema = new Schema<IException>(
  {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      match: TIME_REGEX,
    },
    endTime: {
      type: String,
      match: TIME_REGEX,
    },
    reason: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const AvailabilitySchema = new Schema<IAvailabilityDocument>(
  {
    weeklySlots: {
      type: [WeeklySlotSchema],
      default: [],
    },
    exceptions: {
      type: [ExceptionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'availability',
  }
);

AvailabilitySchema.index({ 'exceptions.startDate': 1 });
AvailabilitySchema.index({ 'weeklySlots.dayOfWeek': 1 });

AvailabilitySchema.index({ singleton: 1 }, { unique: true, sparse: false });

AvailabilitySchema.pre('save', function (next) {
  this.singleton = 1;
  next();
});

export const AvailabilityModel: Model<IAvailabilityDocument> =
  mongoose.models.Availability ||
  mongoose.model<IAvailabilityDocument>('Availability', AvailabilitySchema);
