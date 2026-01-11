export interface ActivityDto {
  id: string;
  name: string;
  description?: string;
  duration: number;
  color: string;
  enabled: boolean;
}

export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  activityId?: string;
  activity?: {
    id: string;
    name: string;
    color: string;
  };
}

export interface ActivityItem {
  id: string;
  name: string;
  description?: string;
  duration: number;
  color: string;
  enabled: boolean;
  isChecked?: boolean;
}
