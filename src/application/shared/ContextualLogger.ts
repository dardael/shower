import type { ILogger } from '@/application/shared/ILogger';

export interface LogContext {
  requestId?: string;
  userId?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  [key: string]: unknown;
}

export class ContextualLogger implements ILogger {
  constructor(
    private readonly baseLogger: ILogger,
    private readonly baseContext: LogContext = {}
  ) {}

  private mergeContext(
    metadata?: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...this.baseContext,
      ...metadata,
      timestamp: new Date().toISOString(),
    };
  }

  withContext(context: Partial<LogContext>): ContextualLogger {
    return new ContextualLogger(this.baseLogger, {
      ...this.baseContext,
      ...context,
    });
  }

  logDebug(message: string, metadata?: Record<string, unknown>): void {
    this.baseLogger.logDebug(message, this.mergeContext(metadata));
  }

  logInfo(message: string, metadata?: Record<string, unknown>): void {
    this.baseLogger.logInfo(message, this.mergeContext(metadata));
  }

  logWarning(message: string, metadata?: Record<string, unknown>): void {
    this.baseLogger.logWarning(message, this.mergeContext(metadata));
  }

  logError(message: string, metadata?: Record<string, unknown>): void {
    this.baseLogger.logError(message, this.mergeContext(metadata));
  }
}
