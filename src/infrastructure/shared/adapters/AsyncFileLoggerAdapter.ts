import { promises as fs } from 'fs';
import { resolve, join } from 'path';
import { LogLevel } from '@/domain/shared/value-objects/LogLevel';
import { LogFormatterService } from '@/domain/shared/services/LogFormatterService';
import { ILogger } from '@/application/shared/ILogger';

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  metadata?: Record<string, unknown>;
}

interface LoggerMetrics {
  totalLogs: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  debugCount: number;
  lastFlushTime: Date;
  averageFlushDuration: number;
  failedWrites: number;
}

export class AsyncFileLoggerAdapter implements ILogger {
  private readonly logFolder: string;
  private readonly currentLogLevel: LogLevel;
  private readonly logBuffer: LogEntry[] = [];
  private readonly bufferSize: number;
  private readonly flushInterval: number;
  private readonly maxRetries: number;
  private readonly retryDelay: number;

  private flushTimer?: NodeJS.Timeout;
  private isWriting = false;
  private isDestroyed = false;
  private metrics: LoggerMetrics;

  constructor(
    private readonly formatter: LogFormatterService,
    options: {
      bufferSize?: number;
      flushInterval?: number;
      maxRetries?: number;
      retryDelay?: number;
      fallbackToConsole?: boolean;
    } = {}
  ) {
    this.bufferSize = options.bufferSize || 100;
    this.flushInterval = options.flushInterval || 5000; // 5 seconds
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000; // 1 second

    // Initialize metrics
    this.metrics = {
      totalLogs: 0,
      errorCount: 0,
      warningCount: 0,
      infoCount: 0,
      debugCount: 0,
      lastFlushTime: new Date(),
      averageFlushDuration: 0,
      failedWrites: 0,
    };

    // Setup log folder
    const envFolder = process.env.LOG_FOLDER || './logs';
    try {
      this.logFolder = resolve(envFolder);
      fs.mkdir(this.logFolder, { recursive: true });
    } catch (err) {
      this.handleCriticalError('Failed to initialize log folder', err as Error);
      this.logFolder = resolve('./logs');
      try {
        fs.mkdir(this.logFolder, { recursive: true });
      } catch (fallbackErr) {
        this.handleCriticalError(
          'Failed to initialize fallback log folder',
          fallbackErr as Error
        );
      }
    }

    // Setup log level
    const envLevel = process.env.LOG_LEVEL || 'info';
    try {
      this.currentLogLevel = LogLevel.fromString(envLevel);
    } catch {
      // Critical: Logger initialization failed, use console as last resort
      console.warn(`Invalid log level: ${envLevel}. Using default 'info'.`);
      this.currentLogLevel = LogLevel.INFO;
    }

    // Start periodic flush
    this.startPeriodicFlush();

    // Handle process exit
    this.setupExitHandlers();
  }

  private startPeriodicFlush(): void {
    this.flushTimer = setInterval(() => {
      if (!this.isDestroyed) {
        this.flushBuffer().catch((error) => {
          this.handleFlushError(error);
        });
      }
    }, this.flushInterval);
  }

  private setupExitHandlers(): void {
    const cleanup = async () => {
      if (!this.isDestroyed) {
        await this.destroy();
      }
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('beforeExit', cleanup);
    process.on('uncaughtException', cleanup);
    process.on('unhandledRejection', cleanup);
  }

  private async flushBuffer(): Promise<void> {
    if (this.isWriting || this.isDestroyed || this.logBuffer.length === 0) {
      return;
    }

    this.isWriting = true;
    const startTime = Date.now();
    const entriesToWrite = [...this.logBuffer];
    this.logBuffer.length = 0;

    try {
      await this.writeEntriesToFile(entriesToWrite);

      // Update metrics
      const flushDuration = Date.now() - startTime;
      this.metrics.lastFlushTime = new Date();
      this.metrics.averageFlushDuration =
        (this.metrics.averageFlushDuration + flushDuration) / 2;
    } catch (error) {
      this.handleFlushError(error);
      // Re-add failed entries to buffer for retry
      this.logBuffer.unshift(...entriesToWrite);
      this.metrics.failedWrites++;
    } finally {
      this.isWriting = false;
    }
  }

  private async writeEntriesToFile(entries: LogEntry[]): Promise<void> {
    const date = new Date().toISOString().split('T')[0];
    const filePath = join(this.logFolder, `${date}.log`);

    const logLines = entries.map((entry) =>
      this.formatter.format(entry.level, entry.message, entry.metadata)
    );

    let retries = 0;
    while (retries <= this.maxRetries) {
      try {
        await fs.appendFile(filePath, logLines.join('\n') + '\n');
        return; // Success
      } catch (error) {
        retries++;
        if (retries > this.maxRetries) {
          throw error;
        }
        // Wait before retry
        await new Promise((resolve) =>
          setTimeout(resolve, this.retryDelay * retries)
        );
      }
    }
  }

  private handleFlushError(error: unknown): void {
    // Critical: Logger flush failed, use console as last resort
    console.error('Logger flush error:', error);

    // Fallback to console if file logging fails repeatedly
    if (this.metrics.failedWrites > 5) {
      console.warn('File logging failing repeatedly, falling back to console');
      this.logBuffer.forEach((entry) => {
        const levelStr = entry.level.toString().toUpperCase();
        const consoleMethod = levelStr.toLowerCase() as
          | 'debug'
          | 'info'
          | 'warn'
          | 'error';
        console[consoleMethod](`[FALLBACK] ${entry.message}`, entry.metadata);
      });
      this.logBuffer.length = 0;
    }
  }

  private handleCriticalError(message: string, error: Error): void {
    // Critical: Logger system failure, use console as last resort
    console.error(`[CRITICAL] ${message}:`, error);
    // In production, you might want to send this to an error monitoring service
  }

  private async log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    if (this.isDestroyed || !level.isHigherOrEqual(this.currentLogLevel)) {
      return;
    }

    // Update metrics
    this.metrics.totalLogs++;
    switch (level) {
      case LogLevel.ERROR:
        this.metrics.errorCount++;
        break;
      case LogLevel.WARNING:
        this.metrics.warningCount++;
        break;
      case LogLevel.INFO:
        this.metrics.infoCount++;
        break;
      case LogLevel.DEBUG:
        this.metrics.debugCount++;
        break;
    }

    this.logBuffer.push({
      timestamp: new Date(),
      level,
      message,
      metadata,
    });

    if (this.logBuffer.length >= this.bufferSize) {
      await this.flushBuffer();
    }
  }

  async logDebug(
    message: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.log(LogLevel.DEBUG, message, metadata);
  }

  async logInfo(
    message: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.log(LogLevel.INFO, message, metadata);
  }

  async logWarning(
    message: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.log(LogLevel.WARNING, message, metadata);
  }

  async logError(
    message: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.log(LogLevel.ERROR, message, metadata);
  }

  // Public API for monitoring
  getMetrics(): LoggerMetrics {
    return { ...this.metrics };
  }

  getBufferSize(): number {
    return this.logBuffer.length;
  }

  async destroy(): Promise<void> {
    if (this.isDestroyed) {
      return;
    }

    this.isDestroyed = true;

    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    // Flush remaining logs
    await this.flushBuffer();
  }
}
