import { Appointment } from '@/domain/appointment/entities/Appointment';
import { Activity } from '@/domain/appointment/entities/Activity';
import { Availability } from '@/domain/appointment/entities/Availability';

export interface AppointmentResponse {
  id: string;
  activityId: string;
  activityName: string;
  activityDurationMinutes: number;
  clientInfo: {
    name: string;
    email: string;
    phone?: string;
    customField?: string;
  };
  dateTime: string;
  endDateTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityResponse {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price?: number;
  color: string;
  requiredFields: {
    fields: string[];
    customFieldLabel?: string;
  };
  reminderSettings: {
    enabled: boolean;
    hoursBefore: number;
  };
  minimumBookingNoticeHours: number;
}

export interface AvailabilityResponse {
  id: string;
  weeklySlots: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>;
  exceptions: Array<{
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
    reason?: string;
  }>;
}

export interface SlotResponse {
  startTime: string;
  endTime: string;
}

export function appointmentToResponse(
  appointment: Appointment
): AppointmentResponse {
  if (!appointment.id) {
    throw new Error('Appointment ID is required for response mapping');
  }
  return {
    id: appointment.id,
    activityId: appointment.activityId,
    activityName: appointment.activityName,
    activityDurationMinutes: appointment.activityDurationMinutes,
    clientInfo: appointment.clientInfo.toObject(),
    dateTime: appointment.dateTime.toISOString(),
    endDateTime: appointment.endDateTime.toISOString(),
    status: appointment.status.value,
    createdAt: appointment.createdAt.toISOString(),
    updatedAt: appointment.updatedAt.toISOString(),
  };
}

export function activityToResponse(activity: Activity): ActivityResponse {
  if (!activity.id) {
    throw new Error('Activity ID is required for response mapping');
  }
  return {
    id: activity.id,
    name: activity.name,
    description: activity.description || '',
    durationMinutes: activity.durationMinutes,
    price: activity.price,
    color: activity.color,
    requiredFields: activity.requiredFields.toObject(),
    reminderSettings: {
      enabled: activity.reminderSettings.enabled,
      hoursBefore: activity.reminderSettings.hoursBefore || 0,
    },
    minimumBookingNoticeHours: activity.minimumBookingNoticeHours || 0,
  };
}

export function availabilityToResponse(
  availability: Availability
): AvailabilityResponse {
  if (!availability.id) {
    throw new Error('Availability ID is required for response mapping');
  }
  return {
    id: availability.id,
    weeklySlots: availability.weeklySlots.map((slot) => slot.toObject()),
    exceptions: availability.exceptions.map((exception) => ({
      startDate: exception.startDate.toISOString().split('T')[0],
      endDate: exception.endDate.toISOString().split('T')[0],
      startTime: exception.startTime,
      endTime: exception.endTime,
      reason: exception.reason || '',
    })),
  };
}

export function slotToResponse(slot: {
  startTime: Date;
  endTime: Date;
}): SlotResponse {
  return {
    startTime: slot.startTime.toISOString(),
    endTime: slot.endTime.toISOString(),
  };
}

export function validateDateParam(dateStr: string): Date {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error('Format de date invalide');
  }
  return date;
}
