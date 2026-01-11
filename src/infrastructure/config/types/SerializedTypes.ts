import type { IIconMetadata } from '@/domain/settings/types/IconMetadata';
import type { ICustomLoaderMetadata } from '@/domain/settings/entities/WebsiteSetting';

/**
 * Serialized representation of a menu item for export/import.
 */
export interface SerializedMenuItem {
  id: string;
  text: string;
  url: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Serialized representation of page content for export/import.
 */
export interface SerializedPageContent {
  id: string;
  menuItemId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Serialized representation of a website setting for export/import.
 */
export interface SerializedSetting {
  key: string;
  value:
    | string
    | { url: string; metadata?: IIconMetadata | ICustomLoaderMetadata }
    | null;
}

/**
 * Serialized representation of a social network for export/import.
 */
export interface SerializedSocialNetwork {
  id?: string;
  type: string;
  url: string;
  label: string;
  enabled: boolean;
}

/**
 * Serialized representation of a product for export/import.
 */
export interface SerializedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  displayOrder: number;
  categoryIds: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Serialized representation of a category for export/import.
 */
export interface SerializedCategory {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Serialized representation of an activity for export/import.
 */
export interface SerializedActivity {
  id?: string;
  name: string;
  description?: string;
  durationMinutes: number;
  color: string;
  price: number;
  requiredFields: {
    fields: string[];
    customFieldLabel?: string;
  };
  reminderSettings: {
    enabled: boolean;
    hoursBefore?: number;
  };
  minimumBookingNoticeHours: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Serialized representation of a weekly slot for export/import.
 */
export interface SerializedWeeklySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

/**
 * Serialized representation of an availability exception for export/import.
 */
export interface SerializedAvailabilityException {
  date: string;
  reason?: string;
}

/**
 * Serialized representation of availability for export/import.
 */
export interface SerializedAvailability {
  id?: string;
  weeklySlots: SerializedWeeklySlot[];
  exceptions: SerializedAvailabilityException[];
  updatedAt: string;
}
