export interface Activity {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price?: number;
  color: string;
  isActive: boolean;
  minimumBookingNoticeHours: number;
  requiredFields: {
    fields: string[];
    customFieldLabel?: string;
  };
  reminderSettings: {
    enabled: boolean;
    hoursBefore?: number;
  };
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}
