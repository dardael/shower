/**
 * Formats a date string to French locale with short date and time.
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string (e.g., "22/12/2025 14:30")
 */
export function formatDateTimeFr(dateString: string | Date): string {
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

/**
 * Formats a date string to French locale with short date only.
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string (e.g., "22/12/2025")
 */
export function formatDateFr(dateString: string | Date): string {
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
  }).format(date);
}

/**
 * Formats a date string to French locale with weekday, day, month, and time.
 * Suitable for appointment list display.
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string (e.g., "lun. 15 janv. 10:00")
 */
export function formatAppointmentDateTime(dateString: string | Date): string {
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Formats a date to French locale with full weekday, day, month, year, and time.
 * Suitable for appointment calendar details display.
 * @param date - Date object
 * @returns Formatted date string (e.g., "lundi 15 janvier 2024 10:00")
 */
export function formatAppointmentDetailDateTime(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Formats a date to French locale with only time.
 * @param date - Date object
 * @returns Formatted time string (e.g., "10:00")
 */
export function formatTimeFr(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
