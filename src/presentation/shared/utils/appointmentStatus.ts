/**
 * Appointment status display utilities
 * Shared between AppointmentList and AppointmentCalendar components
 */

export type AppointmentStatusValue = 'pending' | 'confirmed' | 'cancelled';

/**
 * French labels for appointment statuses
 */
export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatusValue, string> =
  {
    pending: 'En attente',
    confirmed: 'Confirmé',
    cancelled: 'Annulé',
  };

/**
 * Color palettes for appointment statuses (Chakra UI color tokens)
 */
export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatusValue, string> =
  {
    pending: 'yellow',
    confirmed: 'green',
    cancelled: 'gray',
  };

/**
 * Get the French label for an appointment status
 * @param status - The appointment status value
 * @returns French label for the status
 */
export function getAppointmentStatusLabel(status: string): string {
  return APPOINTMENT_STATUS_LABELS[status as AppointmentStatusValue] || status;
}

/**
 * Get the color palette for an appointment status
 * @param status - The appointment status value
 * @returns Chakra UI color palette name
 */
export function getAppointmentStatusColor(status: string): string {
  return APPOINTMENT_STATUS_COLORS[status as AppointmentStatusValue] || 'gray';
}

/**
 * Get the badge color scheme for an appointment status
 * @param status - The appointment status value
 * @returns Chakra UI color scheme for Badge component
 */
export function getAppointmentStatusBadgeColor(
  status: string
): 'green' | 'yellow' | 'red' | 'gray' {
  switch (status) {
    case 'confirmed':
      return 'green';
    case 'pending':
      return 'yellow';
    case 'cancelled':
      return 'red';
    default:
      return 'gray';
  }
}
