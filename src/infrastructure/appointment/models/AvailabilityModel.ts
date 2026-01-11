import mongoose, { Schema, Document, Model } from 'mongoose';
import { TIME_REGEX, AVAILABILITY_CONSTANTS } from '../constants';

interface IWeeklySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface IException {
  date: Date;
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
    date: {
      type: Date,
      required: true,
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

// Indexes for efficient queries
AvailabilitySchema.index({ 'exceptions.date': 1 });
AvailabilitySchema.index({ 'weeklySlots.dayOfWeek': 1 });

// Singleton constraint - ensures only one availability document can exist
// We create a unique index on a constant field that doesn't exist in the schema
// This forces all documents to have the same value and thus only one can exist
AvailabilitySchema.index({ singleton: 1 }, { unique: true, sparse: false });

// Pre-save hook to ensure singleton constraint
AvailabilitySchema.pre('save', function (next) {
  this.singleton = 1;
  next();
});

export const AvailabilityModel: Model<IAvailabilityDocument> =
  mongoose.models.Availability ||
  mongoose.model<IAvailabilityDocument>('Availability', AvailabilitySchema);
