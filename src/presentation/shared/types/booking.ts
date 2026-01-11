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
