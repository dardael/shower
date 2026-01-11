import { TIME_REGEX } from '@/domain/appointment/constants/TimeValidation';

export { TIME_REGEX };

export const CRON_EXPRESSIONS = {
  EVERY_HOUR: '0 * * * *',
  APPOINTMENT_REMINDER: process.env.APPOINTMENT_REMINDER_CRON || '0 * * * *', // Default: every hour at minute 0
} as const;

export const REMINDER_DEFAULTS = {
  HOURS_BEFORE: 24,
  CHECK_WINDOW_HOURS: 25,
} as const;

export const TIME_VALUES = {
  START_OF_DAY: { hour: 0, minute: 0, second: 0, millisecond: 0 },
  END_OF_DAY: { hour: 23, minute: 59, second: 59, millisecond: 999 },
  MILLISECONDS_PER_HOUR: 60 * 60 * 1000,
} as const;

export const AVAILABILITY_CONSTANTS = {
  DAY_OF_WEEK_MIN: 0,
  DAY_OF_WEEK_MAX: 6,
} as const;

export function calculateReminderTime(
  appointmentTime: Date,
  hoursBefore: number
): Date {
  return new Date(appointmentTime.getTime() - hoursBefore * 60 * 60 * 1000);
}

export function getStartOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(
    TIME_VALUES.START_OF_DAY.hour,
    TIME_VALUES.START_OF_DAY.minute,
    TIME_VALUES.START_OF_DAY.second,
    TIME_VALUES.START_OF_DAY.millisecond
  );
  return result;
}

export function getEndOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(
    TIME_VALUES.END_OF_DAY.hour,
    TIME_VALUES.END_OF_DAY.minute,
    TIME_VALUES.END_OF_DAY.second,
    TIME_VALUES.END_OF_DAY.millisecond
  );
  return result;
}

export function getNextDay(date: Date): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + 1);
  return result;
}
