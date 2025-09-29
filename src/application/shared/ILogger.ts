export interface ILogger {
  logDebug(message: string, metadata?: Record<string, unknown>): void;
  logInfo(message: string, metadata?: Record<string, unknown>): void;
  logWarning(message: string, metadata?: Record<string, unknown>): void;
  logError(message: string, metadata?: Record<string, unknown>): void;
}
