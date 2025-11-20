import { LogLevel, shouldLog, getLogLevel } from '../utils/logLevelUtils';

export interface Timer {
  operation: string;
  startTime: number;
  metadata?: Record<string, unknown>;
}

export class BackendLog {
  private currentLogLevel: LogLevel;

  constructor() {
    this.currentLogLevel = getLogLevel();
  }

  debug(message: string, ...data: Record<string, unknown>[]): void {
    if (shouldLog('DEBUG', this.currentLogLevel)) {
      console.debug(`[DEBUG] ${message}`, ...data);
    }
  }

  info(message: string, ...data: Record<string, unknown>[]): void {
    if (shouldLog('INFO', this.currentLogLevel)) {
      console.log(`[INFO] ${message}`, ...data);
    }
  }

  warn(message: string, ...data: Record<string, unknown>[]): void {
    if (shouldLog('WARNING', this.currentLogLevel)) {
      console.warn(`[WARNING] ${message}`, ...data);
    }
  }

  error(message: string, ...data: Record<string, unknown>[]): void {
    if (shouldLog('ERROR', this.currentLogLevel)) {
      console.error(`[ERROR] ${message}`, ...data);
    }
  }

  startTimer(operation: string, metadata?: Record<string, unknown>): Timer {
    return {
      operation,
      startTime: Date.now(), // Use Date.now() for server-side timing
      metadata,
    };
  }

  endTimer(timer: Timer, metadata?: Record<string, unknown>): void {
    const duration = Date.now() - timer.startTime;
    this.info(`${timer.operation} completed in ${duration}ms`, {
      ...timer.metadata,
      ...metadata,
      duration,
    });
  }
}

export const backendLog = new BackendLog();
