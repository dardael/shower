import type { ILogger } from '@/application/shared/ILogger';
import {
  BackendLog,
  type Timer,
} from '@/infrastructure/shared/services/BackendLog';

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

/**
 * Simple performance monitor for the simplified logging system
 */
class SimplePerformanceMonitor {
  constructor(private backendLog: BackendLog) {}

  startTimer(operation: string, metadata?: Record<string, unknown>): Timer {
    return this.backendLog.startTimer(operation, metadata);
  }

  endTimer(timer: Timer, additionalMetadata?: Record<string, unknown>): void {
    this.backendLog.endTimer(timer, additionalMetadata);
  }

  async measure<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    const timer = this.startTimer(operation, metadata);
    try {
      const result = await fn();
      this.endTimer(timer, { success: true });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.endTimer(timer, {
        success: false,
        error: errorMessage,
      });
      throw error;
    }
  }
}

export class Logger implements ILogger {
  private backendLog: BackendLog;

  constructor() {
    this.backendLog = new BackendLog();
  }

  // Interface implementation methods
  logDebug(message: string, metadata?: Record<string, unknown>): void {
    this.backendLog.debug(message, metadata || {});
  }

  logInfo(message: string, metadata?: Record<string, unknown>): void {
    this.backendLog.info(message, metadata || {});
  }

  logWarning(message: string, metadata?: Record<string, unknown>): void {
    this.backendLog.warn(message, metadata || {});
  }

  logError(message: string, metadata?: Record<string, unknown>): void {
    this.backendLog.error(message, metadata || {});
  }

  // Direct logging methods - consistent with console API (for convenience)
  debug(message: string, ...data: unknown[]): void {
    if (data.length === 0) {
      this.logDebug(message);
    } else if (
      data.length === 1 &&
      typeof data[0] === 'object' &&
      data[0] !== null
    ) {
      this.logDebug(message, data[0] as Record<string, unknown>);
    } else {
      this.logDebug(message, { data });
    }
  }

  info(message: string, ...data: unknown[]): void {
    if (data.length === 0) {
      this.logInfo(message);
    } else if (
      data.length === 1 &&
      typeof data[0] === 'object' &&
      data[0] !== null
    ) {
      this.logInfo(message, data[0] as Record<string, unknown>);
    } else {
      this.logInfo(message, { data });
    }
  }

  warn(message: string, ...data: unknown[]): void {
    if (data.length === 0) {
      this.logWarning(message);
    } else if (
      data.length === 1 &&
      typeof data[0] === 'object' &&
      data[0] !== null
    ) {
      this.logWarning(message, data[0] as Record<string, unknown>);
    } else {
      this.logWarning(message, { data });
    }
  }

  error(message: string, ...data: unknown[]): void {
    if (data.length === 0) {
      this.logError(message);
    } else if (
      data.length === 1 &&
      typeof data[0] === 'object' &&
      data[0] !== null
    ) {
      this.logError(message, data[0] as Record<string, unknown>);
    } else {
      this.logError(message, { data });
    }
  }

  // Add missing methods from old interface for backward compatibility
  execute(
    level: unknown,
    message: string,
    metadata?: Record<string, unknown>
  ): void {
    // For backward compatibility - map to appropriate log level
    const meta = metadata || {};

    if (!level) {
      this.info(message, meta);
      return;
    }

    // Handle string levels
    if (typeof level === 'string') {
      const upperLevel = level.toUpperCase();
      if (upperLevel.includes('DEBUG')) this.debug(message, meta);
      else if (upperLevel.includes('INFO')) this.info(message, meta);
      else if (upperLevel.includes('WARN') || upperLevel.includes('WARNING'))
        this.warn(message, meta);
      else if (upperLevel.includes('ERROR')) this.error(message, meta);
      else this.info(message, meta);
      return;
    }

    // Handle objects with toString method
    if (typeof level === 'object' && level !== null) {
      const levelStr = String(level).toUpperCase();
      if (levelStr.includes('DEBUG')) this.debug(message, meta);
      else if (levelStr.includes('INFO')) this.info(message, meta);
      else if (levelStr.includes('WARN') || levelStr.includes('WARNING'))
        this.warn(message, meta);
      else if (levelStr.includes('ERROR')) this.error(message, meta);
      else this.info(message, meta);
      return;
    }

    // Default to info
    this.info(message, meta);
  }

  withContext(): Logger {
    // Return a new logger instance (simplified)
    return new Logger();
  }

  batch(
    entries: Array<{
      level?: unknown;
      message?: string;
      metadata?: Record<string, unknown>;
    }>
  ): void {
    // Process batch entries (simplified)
    entries.forEach((entry) => {
      if (entry.level && entry.message) {
        this.execute(entry.level, entry.message, entry.metadata || {});
      }
    });
  }

  logIf(
    condition: boolean,
    level: unknown,
    message: string,
    metadata?: Record<string, unknown>
  ): void {
    if (condition) {
      this.execute(level, message, metadata || {});
    }
  }

  debugIf(
    message: string,
    condition: boolean = true,
    metadata?: Record<string, unknown>
  ): void {
    if (condition) {
      this.debug(message, metadata || {});
    }
  }

  child(): Logger {
    return new Logger();
  }

  getPerformanceMonitor(): SimplePerformanceMonitor {
    return new SimplePerformanceMonitor(this.backendLog);
  }

  getPerformanceStatistics(): Record<string, unknown> {
    return {
      totalMetrics: 0,
      activeMetrics: 0,
      totalAlerts: 0,
      criticalAlerts: 0,
      warningAlerts: 0,
      recentAlerts: [],
    };
  }

  setPerformanceThreshold(): void {
    // No-op in simplified version
  }

  // Convenience methods for common scenarios

  /**
   * Log errors with proper error object handling
   */
  logErrorWithType(message: string, metadata?: Record<string, unknown>): void {
    this.logError(message, {
      ...metadata,
      type: 'error',
    });
  }

  /**
   * Log errors with proper error object handling (enhanced version)
   * This method provides additional error object processing
   */
  logErrorWithObject(
    error: unknown,
    message?: string,
    metadata?: Record<string, unknown>
  ): void {
    const normalizedError = this.normalizeError(error);
    this.logError(message || normalizedError.message, {
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
    const level = statusCode >= 400 ? 'warn' : 'info';
    this[level](
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
    return this.backendLog.startTimer(operation, metadata);
  }

  /**
   * End performance measurement and log
   */
  endTimer(
    metrics: PerformanceMetrics,
    additionalMetadata?: Record<string, unknown>
  ): void {
    this.backendLog.endTimer(metrics, additionalMetadata);
  }

  /**
   * Measure and log an async operation
   */
  async measure<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> {
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
   * Normalize any value to an Error instance
   */
  private normalizeError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
  }
}
