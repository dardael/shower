export const TIME_CONSTANTS = {
  SLOT_GENERATION_INTERVAL_MINUTES: 30,
  DEFAULT_MINIMUM_BOOKING_NOTICE_HOURS: 0,
  DEFAULT_DURATION_MINUTES: 60,
} as const;

export const CALENDAR_CONSTANTS = {
  DEFAULT_ACTIVITY_COLOR: '#3788d8',
  DEFAULT_MIN_TIME: '07:00:00',
  DEFAULT_MAX_TIME: '21:00:00',
} as const;

export function hoursToMs(hours: number): number {
  return hours * 60 * 60 * 1000;
}

export function minutesToMs(minutes: number): number {
  return minutes * 60 * 1000;
}
