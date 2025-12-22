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
