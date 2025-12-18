export interface ScheduledRestartConfigResponse {
  enabled: boolean;
  restartHour: number;
  timezone: string;
  lastRestartAt: string | null;
}

export interface UpdateScheduledRestartRequest {
  enabled: boolean;
  restartHour: number;
  timezone: string;
}

export interface UpdateScheduledRestartResponse {
  message: string;
  enabled: boolean;
  restartHour: number;
  timezone: string;
}

export interface ScheduledRestartErrorResponse {
  error: string;
}
