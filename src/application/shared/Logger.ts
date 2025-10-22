import { LogLevel } from '@/domain/shared/value-objects/LogLevel';
import type { ILogger } from '@/application/shared/ILogger';
import { ContextualLogger, type LogContext } from './ContextualLogger';
import { PerformanceMonitor } from './PerformanceMonitor';

export interface PerformanceMetrics {
  operation: string;
  startTime: number;
  metadata?: Record<string, unknown>;
}

export interface SecurityContext {
  event: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

export class Logger {
  private performanceMonitor?: PerformanceMonitor;

  constructor(private readonly logger: ILogger) {
    // Initialize performance monitor in production or when explicitly enabled
    if (
      process.env.NODE_ENV === 'production' ||
      process.env.ENABLE_PERFORMANCE_MONITORING === 'true'
    ) {
      this.performanceMonitor = new PerformanceMonitor(this);
    }
  }

  /**
   * Normalize any value to an Error instance
   */
  private normalizeError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
  }

  // Direct logging methods - consistent with console API
  debug(message: string, metadata?: Record<string, unknown>): void {
    this.logger.logDebug(message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.logger.logInfo(message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.logger.logWarning(message, metadata);
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    this.logger.logError(message, metadata);
  }

  // Level-based logging (consistent with LogMessage)
  execute(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>
  ): void {
    if (level.equals(LogLevel.DEBUG)) {
      this.debug(message, metadata);
    } else if (level.equals(LogLevel.INFO)) {
      this.info(message, metadata);
    } else if (level.equals(LogLevel.WARNING)) {
      this.warn(message, metadata);
    } else if (level.equals(LogLevel.ERROR)) {
      this.error(message, metadata);
    }
  }

  // Context-aware logging
  withContext(context: LogContext): ContextualLogger {
    return new ContextualLogger(this.logger, context);
  }

  // Convenience methods for common scenarios

  /**
   * Log errors with proper error object handling
   */
  logError(
    error: unknown,
    message?: string,
    metadata?: Record<string, unknown>
  ): void {
    const normalizedError = this.normalizeError(error);
    this.error(message || normalizedError.message, {
      ...metadata,
      error: {
        name: normalizedError.name,
        message: normalizedError.message,
        stack: normalizedError.stack,
      },
      type: 'error',
    });
  }

  /**
   * Log API requests
   */
  logApiRequest(
    method: string,
    url: string,
    userId?: string,
    metadata?: Record<string, unknown>
  ): void {
    this.info(`API Request: ${method} ${url}`, {
      ...metadata,
      method,
      url,
      userId,
      type: 'api_request',
    });
  }

  /**
   * Log API responses
   */
  logApiResponse(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    metadata?: Record<string, unknown>
  ): void {
    const level = statusCode >= 400 ? LogLevel.WARNING : LogLevel.INFO;
    this.execute(
      level,
      `API Response: ${method} ${url} - ${statusCode} (${duration}ms)`,
      {
        ...metadata,
        method,
        url,
        statusCode,
        duration,
        type: 'api_response',
      }
    );
  }

  /**
   * Start performance measurement
   */
  startTimer(
    operation: string,
    metadata?: Record<string, unknown>
  ): PerformanceMetrics {
    return {
      operation,
      startTime: Date.now(),
      metadata,
    };
  }

  /**
   * End performance measurement and log
   */
  endTimer(
    metrics: PerformanceMetrics,
    additionalMetadata?: Record<string, unknown>
  ): void {
    const duration = Date.now() - metrics.startTime;
    const level = duration > 1000 ? LogLevel.WARNING : LogLevel.INFO;

    this.execute(
      level,
      `Performance: ${metrics.operation} took ${duration}ms`,
      {
        ...metrics.metadata,
        ...additionalMetadata,
        operation: metrics.operation,
        duration,
        type: 'performance',
      }
    );
  }

  /**
   * Measure and log an async operation
   */
  async measure<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    // Use performance monitor if available, otherwise fall back to simple timer
    if (this.performanceMonitor) {
      return this.performanceMonitor.measure(operation, fn, metadata);
    }

    const timer = this.startTimer(operation, metadata);
    try {
      const result = await fn();
      this.endTimer(timer, { success: true });
      return result;
    } catch (error) {
      const normalizedError = this.normalizeError(error);
      this.endTimer(timer, {
        success: false,
        error: normalizedError.message,
      });
      throw error;
    }
  }

  /**
   * Log security events
   */
  logSecurity(context: SecurityContext): void {
    this.warn(`Security Event: ${context.event}`, {
      ...context.metadata,
      event: context.event,
      userId: context.userId,
      ip: context.ip,
      userAgent: context.userAgent,
      type: 'security',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log user actions
   */
  logUserAction(
    action: string,
    userId?: string,
    metadata?: Record<string, unknown>
  ): void {
    this.info(`User Action: ${action}`, {
      ...metadata,
      action,
      userId,
      type: 'user_action',
    });
  }

  /**
   * Log business events
   */
  logBusinessEvent(event: string, metadata?: Record<string, unknown>): void {
    this.info(`Business Event: ${event}`, {
      ...metadata,
      event,
      type: 'business_event',
    });
  }

  /**
   * Log system events
   */
  logSystemEvent(event: string, metadata?: Record<string, unknown>): void {
    this.info(`System Event: ${event}`, {
      ...metadata,
      event,
      type: 'system_event',
    });
  }

  /**
   * Create a child logger with additional context
   */
  child(context: LogContext): Logger {
    const contextualLogger = new ContextualLogger(this.logger, context);

    // Return a new Logger that uses the contextual logger internally
    return new Logger({
      logDebug: (message: string, metadata?: Record<string, unknown>) =>
        contextualLogger.logDebug(message, metadata),
      logInfo: (message: string, metadata?: Record<string, unknown>) =>
        contextualLogger.logInfo(message, metadata),
      logWarning: (message: string, metadata?: Record<string, unknown>) =>
        contextualLogger.logWarning(message, metadata),
      logError: (message: string, metadata?: Record<string, unknown>) =>
        contextualLogger.logError(message, metadata),
    });
  }

  /**
   * Batch multiple log entries
   */
  batch(
    entries: Array<{
      level: LogLevel;
      message: string;
      metadata?: Record<string, unknown>;
    }>
  ): void {
    entries.forEach((entry) => {
      this.execute(entry.level, entry.message, entry.metadata);
    });
  }

  /**
   * Conditional logging
   */
  logIf(
    condition: boolean,
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>
  ): void {
    if (condition) {
      this.execute(level, message, metadata);
    }
  }

  /**
   * Debug logging with automatic environment check
   */
  debugIf(
    message: string,
    condition: boolean = true,
    metadata?: Record<string, unknown>
  ): void {
    if (process.env.NODE_ENV !== 'production' && condition) {
      this.debug(message, metadata);
    }
  }

  /**
   * Get performance monitor instance
   */
  getPerformanceMonitor(): PerformanceMonitor | undefined {
    return this.performanceMonitor;
  }

  /**
   * Get performance statistics
   */
  getPerformanceStatistics() {
    return (
      this.performanceMonitor?.getStatistics() || {
        totalMetrics: 0,
        activeMetrics: 0,
        totalAlerts: 0,
        criticalAlerts: 0,
        warningAlerts: 0,
        recentAlerts: [],
      }
    );
  }

  /**
   * Set performance threshold for an operation
   */
  setPerformanceThreshold(
    operation: string,
    threshold: { warning: number; critical: number }
  ): void {
    this.performanceMonitor?.setThreshold(operation, threshold);
  }
}
