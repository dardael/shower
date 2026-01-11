/**
 * Validation utilities for appointment API routes
 */

interface ValidationError {
  field: string;
  message: string;
}

export class ValidationResult {
  private errors: ValidationError[] = [];

  addError(field: string, message: string): void {
    this.errors.push({ field, message });
  }

  isValid(): boolean {
    return this.errors.length === 0;
  }

  getErrors(): ValidationError[] {
    return this.errors;
  }

  getErrorMessage(): string {
    return this.errors.map((e) => `${e.field}: ${e.message}`).join(', ');
  }
}

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

export function validateActivityInput(data: {
  name?: unknown;
  durationMinutes?: unknown;
  price?: unknown;
  color?: unknown;
  minimumBookingNoticeHours?: unknown;
}): ValidationResult {
  const result = new ValidationResult();

  // Validate name
  if (typeof data.name !== 'string' || data.name.trim().length === 0) {
    result.addError('name', 'Le nom est requis');
  }

  // Validate durationMinutes
  if (typeof data.durationMinutes !== 'number' || data.durationMinutes <= 0) {
    result.addError('durationMinutes', 'La durée doit être un nombre positif');
  }

  // Validate price (optional, but must be non-negative if provided)
  if (data.price !== undefined && data.price !== null) {
    if (typeof data.price !== 'number' || data.price < 0) {
      result.addError('price', 'Le prix doit être un nombre non négatif');
    }
  }

  // Validate color
  if (typeof data.color !== 'string' || !HEX_COLOR_REGEX.test(data.color)) {
    result.addError(
      'color',
      'La couleur doit être au format hexadécimal (ex: #FF5733)'
    );
  }

  // Validate minimumBookingNoticeHours
  if (
    typeof data.minimumBookingNoticeHours !== 'number' ||
    data.minimumBookingNoticeHours < 0
  ) {
    result.addError(
      'minimumBookingNoticeHours',
      'Le délai minimum de réservation doit être un nombre non négatif'
    );
  }

  return result;
}

export function validateDate(dateString: string): Date {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Date invalide');
  }
  return date;
}
