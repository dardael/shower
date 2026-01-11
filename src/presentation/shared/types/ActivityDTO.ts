/**
 * Shared Activity type for presentation layer components
 * This mirrors the API response structure for activities
 */
export interface ActivityDTO {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  color: string;
  price: number;
  requiredFields: RequiredFieldsDTO;
  reminderSettings: ReminderSettingsDTO;
  minimumBookingNoticeHours: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RequiredFieldsDTO {
  fields: string[];
  customFieldLabel?: string;
}

export interface ReminderSettingsDTO {
  enabled: boolean;
  hoursBefore?: number;
}

/**
 * Simplified activity type for public booking components
 */
export interface PublicActivityDTO {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price?: number;
  color: string;
  requiredFields?: {
    phone?: boolean;
    address?: boolean;
    customField?: boolean;
    customFieldLabel?: string;
    fields?: string[];
  };
}
