import type { ClientLogEntry } from '@/infrastructure/shared/types/LogEntry';
import { LogLevel } from '@/domain/shared/value-objects/LogLevel';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import { SystemConsoleLogger } from '@/infrastructure/shared/utils/SystemConsoleLogger';

/**
 * Client Log Processor
 *
 * Processes client log entries without creating circular dependencies.
 * This service is responsible for taking client logs and routing them
 * to the appropriate logging infrastructure.
 *
 * It's designed to work independently of the main Logger initialization
 * to prevent circular dependencies in the /api/logs endpoint.
 */
export class ClientLogProcessor {
  private static instance: ClientLogProcessor;
  private logger: Logger | null = null;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): ClientLogProcessor {
    if (!ClientLogProcessor.instance) {
      ClientLogProcessor.instance = new ClientLogProcessor();
    }
    return ClientLogProcessor.instance;
  }

  /**
   * Process a batch of client log entries
   *
   * This method handles the circular dependency by lazily initializing
   * the Logger only when needed, and gracefully handling cases where
   * the Logger is not available.
   */
  async processLogBatch(
    logs: ClientLogEntry[],
    clientInfo: {
      userAgent: string;
      ip: string;
      timestamp: string;
    }
  ): Promise<{
    processed: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let processed = 0;

    // Ensure logger is initialized
    await this.ensureLoggerInitialized();

    if (!this.logger) {
      return {
        processed: 0,
        errors: ['Logger not available - logs not processed'],
      };
    }

    // Process each log entry
    for (const logEntry of logs) {
      try {
        await this.processLogEntry(logEntry, clientInfo);
        processed++;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Failed to process log entry: ${errorMessage}`);

        // Try to log the processing error
        try {
          this.logger.error('Failed to process client log entry', {
            originalError: errorMessage,
            logEntry,
            clientInfo,
          });
        } catch {
          // If even error logging fails, continue silently
        }
      }
    }

    return { processed, errors };
  }

  /**
   * Process a single log entry
   */
  private async processLogEntry(
    logEntry: ClientLogEntry,
    clientInfo: {
      userAgent: string;
      ip: string;
      timestamp: string;
    }
  ): Promise<void> {
    if (!this.logger) {
      throw new Error('Logger not initialized');
    }

    let logLevel: LogLevel;
    try {
      logLevel = LogLevel.fromString(logEntry.level);
    } catch {
      // Default to INFO for unknown log levels
      logLevel = LogLevel.INFO;
    }
    const enhancedMetadata = {
      ...logEntry.metadata,
      source: 'client',
      clientContext: logEntry.clientContext,
      batchInfo: {
        clientInfo,
        receivedAt: new Date().toISOString(),
      },
    };

    // Route to appropriate logger method
    if (logLevel.equals(LogLevel.DEBUG)) {
      this.logger.debug(logEntry.message, enhancedMetadata);
    } else if (logLevel.equals(LogLevel.INFO)) {
      this.logger.info(logEntry.message, enhancedMetadata);
    } else if (logLevel.equals(LogLevel.WARNING)) {
      this.logger.warn(logEntry.message, enhancedMetadata);
    } else if (logLevel.equals(LogLevel.ERROR)) {
      this.logger.error(logEntry.message, enhancedMetadata);
    } else {
      // Default to info for unknown levels
      this.logger.info(logEntry.message, enhancedMetadata);
    }
  }

  /**
   * Ensure logger is initialized without creating circular dependencies
   */
  private async ensureLoggerInitialized(): Promise<void> {
    if (this.logger !== null) {
      return; // Already initialized
    }

    if (this.initializationPromise) {
      return this.initializationPromise; // Initialization in progress
    }

    this.initializationPromise = this.initializeLogger();
    return this.initializationPromise;
  }

  /**
   * Initialize the logger with proper error handling
   */
  private async initializeLogger(): Promise<void> {
    try {
      this.logger = container.resolve<Logger>('Logger');
    } catch (error) {
      // Logger not available - this is acceptable in some scenarios
      this.logger = null;

      // Log to system console for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        const systemLogger = SystemConsoleLogger.getInstance();
        systemLogger.warn('Logger not available', {
          error: error instanceof Error ? error.message : 'Unknown error',
          component: 'ClientLogProcessor',
        });
      }
    }
  }

  /**
   * Check if logger is available
   */
  isLoggerAvailable(): boolean {
    return this.logger !== null;
  }

  /**
   * Force re-initialization of the logger (useful for testing)
   */
  async reinitializeLogger(): Promise<void> {
    this.logger = null;
    this.initializationPromise = null;
    await this.ensureLoggerInitialized();
  }

  /**
   * Reset the singleton instance (for testing)
   */
  static resetInstance(): void {
    ClientLogProcessor.instance = null as unknown as ClientLogProcessor;
  }
}
