export interface ScheduledRestartConfigResponse {
  enabled: boolean;
  restartHour: number;
}

export interface UpdateScheduledRestartRequest {
  enabled: boolean;
  restartHour: number;
}

export interface UpdateScheduledRestartResponse {
  message: string;
  enabled: boolean;
  restartHour: number;
}

export interface ScheduledRestartErrorResponse {
  error: string;
}
