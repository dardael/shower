export interface ClientLogEntry {
  level: string;
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
  clientContext?: {
    userAgent?: string;
    screenResolution?: string;
    timezone?: string;
    language?: string;
    sessionId?: string;
  };
}

export interface LogBatch {
  logs: ClientLogEntry[];
  source: 'client';
  timestamp: string;
  clientInfo: {
    userAgent: string;
    ip: string;
    timestamp: string;
  };
}

export interface QueuedLogEntry extends ClientLogEntry {
  id: string;
  retryCount: number;
  createdAt: number;
}

export interface RemoteLoggerConfig {
  batchSize: number;
  batchInterval: number;
  maxRetries: number;
  retryDelay: number;
  maxQueueSize: number;
  fallbackToConsole: boolean;
}
