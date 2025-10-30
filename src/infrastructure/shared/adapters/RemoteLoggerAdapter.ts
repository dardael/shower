import { LogLevel } from '@/domain/shared/value-objects/LogLevel';
import { ILogger } from '@/application/shared/ILogger';
import type {
  ClientLogEntry,
  QueuedLogEntry,
  RemoteLoggerConfig,
} from '@/infrastructure/shared/types/LogEntry';
import { ClientLogAuthManager } from './ClientLogAuthManager';
import { CompressionService } from '@/infrastructure/shared/services/CompressionService';

// Configuration constants
const DEFAULT_BATCH_SIZE = 10;
const DEFAULT_BATCH_INTERVAL = 5000; // 5 seconds
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second
const DEFAULT_MAX_QUEUE_SIZE = 1000;
const COMPRESSION_THRESHOLD = 1024; // 1KB
const MAX_MESSAGE_LENGTH = 1000;
const MAX_USER_AGENT_LENGTH = 500;
const MAX_LANGUAGE_LENGTH = 10;
const EXPONENTIAL_BACKOFF_BASE = 2;

/**
 * Remote Logger Adapter that sends logs to server via HTTP API
 * Includes batching, fallback, and offline support
 */
export class RemoteLoggerAdapter implements ILogger {
  private static instance: RemoteLoggerAdapter | null = null;
  private logQueue: QueuedLogEntry[] = [];
  private batchTimer: ReturnType<typeof setTimeout> | null = null;
  private isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private config: RemoteLoggerConfig;
  private authManager: ClientLogAuthManager;

  // Store event handler references for proper cleanup
  private onlineHandler: () => void;
  private offlineHandler: () => void;
  private beforeUnloadHandler: () => void;
  private visibilityChangeHandler: () => void;

  private constructor(config?: Partial<RemoteLoggerConfig>) {
    this.config = {
      batchSize: DEFAULT_BATCH_SIZE,
      batchInterval: DEFAULT_BATCH_INTERVAL,
      maxRetries: DEFAULT_MAX_RETRIES,
      retryDelay: DEFAULT_RETRY_DELAY,
      maxQueueSize: DEFAULT_MAX_QUEUE_SIZE,
      fallbackToConsole: false,
      ...config,
    };

    this.authManager = ClientLogAuthManager.getInstance(config);

    // Initialize event handler references
    this.onlineHandler = () => {
      this.isOnline = true;
      this.processQueue();
    };

    this.offlineHandler = () => {
      this.isOnline = false;
    };

    this.beforeUnloadHandler = () => {
      this.sendBatch(true); // Use sendBeacon for page unload
    };

    this.visibilityChangeHandler = () => {
      if (!document.hidden && this.logQueue.length > 0) {
        this.processQueue();
      }
    };

    this.initializeEventListeners();
  }

  static getInstance(
    config?: Partial<RemoteLoggerConfig>
  ): RemoteLoggerAdapter {
    if (!RemoteLoggerAdapter.instance) {
      RemoteLoggerAdapter.instance = new RemoteLoggerAdapter(config);
    }
    return RemoteLoggerAdapter.instance;
  }

  private initializeEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Listen for online/offline events
    window.addEventListener('online', this.onlineHandler);
    window.addEventListener('offline', this.offlineHandler);

    // Send pending logs on page unload
    window.addEventListener('beforeunload', this.beforeUnloadHandler);

    // Send logs when page becomes visible
    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
  }

  /**
   * Deep clone an object using structuredClone with fallback
   * More efficient than JSON.parse(JSON.stringify())
   */
  private deepClone<T>(obj: T): T {
    if (typeof structuredClone !== 'undefined') {
      try {
        return structuredClone(obj);
      } catch {
        // Fallback to JSON method if structuredClone fails
        return JSON.parse(JSON.stringify(obj)) as T;
      }
    }
    // Fallback for environments without structuredClone
    return JSON.parse(JSON.stringify(obj)) as T;
  }

  private getClientContext(): ClientLogEntry['clientContext'] {
    if (typeof window === 'undefined') return undefined;

    return {
      userAgent: navigator.userAgent.substring(0, MAX_USER_AGENT_LENGTH),
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language.substring(0, MAX_LANGUAGE_LENGTH),
      sessionId: this.getSessionId(),
    };
  }

  private getSessionId(): string {
    const storageKey = 'logger_session_id';
    let sessionId: string | null = null;
    let sessionStorageAvailable = true;

    try {
      // Try to get existing session ID from sessionStorage
      sessionId = sessionStorage.getItem(storageKey);
    } catch {
      sessionStorageAvailable = false;
      // sessionStorage not available, using memory-based session ID
    }

    if (!sessionId) {
      // Generate new session ID
      sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

      if (sessionStorageAvailable) {
        try {
          // Try to store in sessionStorage
          sessionStorage.setItem(storageKey, sessionId);
        } catch {
          sessionStorageAvailable = false;
          // sessionStorage write failed, using memory-based session ID
          // In this case, the session ID will be generated fresh each time
          // This is acceptable for logging purposes
        }
      }
    }

    return sessionId;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>
  ): QueuedLogEntry {
    return {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      level: level.toString(),
      message: message.substring(0, MAX_MESSAGE_LENGTH),
      metadata: metadata ? this.deepClone(metadata) : {},
      timestamp: new Date().toISOString(),
      clientContext: this.getClientContext(),
      retryCount: 0,
      createdAt: Date.now(),
    };
  }

  private addToQueue(entry: QueuedLogEntry): void {
    try {
      // Remove old entries if queue is full
      if (this.logQueue.length >= this.config.maxQueueSize) {
        this.logQueue.splice(
          0,
          this.logQueue.length - this.config.maxQueueSize + 1
        );
        // Queue overflow, dropping old entries silently
        // Old entries are removed to make room for new ones
      }

      this.logQueue.push(entry);

      // Start batch timer if not already running
      if (!this.batchTimer) {
        this.batchTimer = setTimeout(() => {
          try {
            this.processQueue().catch(() => {
              // Batch timer processing failed - logs will be retried or lost
            });
          } finally {
            this.batchTimer = null;
          }
        }, this.config.batchInterval);
      }

      // Send immediately if batch size reached
      if (this.logQueue.length >= this.config.batchSize) {
        // Clear existing timer since we're processing immediately
        if (this.batchTimer) {
          clearTimeout(this.batchTimer);
          this.batchTimer = null;
        }
        this.processQueue().catch(() => {
          // Batch processing failed - logs will be retried or lost
        });
      }
    } catch {
      // Queue operations failed - log entry is lost
      // This is expected behavior when console fallback is disabled
    }
  }

  private async processQueue(): Promise<void> {
    if (this.logQueue.length === 0) return;

    const batch = this.logQueue.splice(0, this.config.batchSize);

    try {
      await this.sendBatch(false, batch);
    } catch (processingError) {
      // Enhanced error handling for queue processing
      const errorInfo = this.categorizeError(processingError, false);

      // Queue processing failed - logs will be retried or lost based on retry policy

      // Re-queue failed logs if they haven't exceeded max retries
      const retryableLogs = batch.filter(
        (entry) => entry.retryCount < this.config.maxRetries
      );
      if (retryableLogs.length > 0) {
        const retriedLogs = retryableLogs.map((entry) => ({
          ...entry,
          retryCount: entry.retryCount + 1,
          lastError: {
            message: errorInfo.message,
            category: errorInfo.category,
            timestamp: new Date().toISOString(),
          },
        }));

        // Add back to queue with delay
        setTimeout(() => {
          this.logQueue.unshift(...retriedLogs);
        }, this.config.retryDelay);
      }
    }
  }

  private async sendBatch(
    isPageUnload = false,
    batch?: QueuedLogEntry[]
  ): Promise<void> {
    const logsToSend = batch || this.logQueue.splice(0, this.config.batchSize);
    if (logsToSend.length === 0) return;

    const validLogs = this.filterValidLogs(logsToSend);
    if (validLogs.length === 0) return;

    try {
      if (this.shouldUseSendBeacon(isPageUnload)) {
        await this.sendWithBeacon(validLogs);
      } else {
        await this.sendWithFetch(validLogs);
      }
    } catch (error) {
      await this.handleSendError(error, validLogs, isPageUnload);
    }
  }

  private filterValidLogs(logs: QueuedLogEntry[]): QueuedLogEntry[] {
    return logs.filter((entry) => entry.retryCount < this.config.maxRetries);
  }

  private shouldUseSendBeacon(isPageUnload: boolean): boolean {
    return (
      isPageUnload && typeof navigator !== 'undefined' && !!navigator.sendBeacon
    );
  }

  private async prepareRequestBody(logs: QueuedLogEntry[]): Promise<{
    body: string;
    headers: Record<string, string>;
  }> {
    const payload = { logs };
    const jsonString = JSON.stringify(payload);
    const shouldCompress = jsonString.length > COMPRESSION_THRESHOLD;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (shouldCompress) {
      const compressionResult = await CompressionService.compress(jsonString);
      if (compressionResult) {
        return {
          body: compressionResult.compressed,
          headers: {
            ...headers,
            'Content-Encoding': 'gzip',
            'X-Compressed': 'true',
          },
        };
      }
    }

    return { body: jsonString, headers };
  }

  private async sendWithBeacon(logs: QueuedLogEntry[]): Promise<void> {
    const token = await this.authManager.getAuthToken();
    const securePayload = {
      logs,
      auth: token ? { token } : undefined,
      metadata: {
        source: 'client',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      },
    };

    const secureBody = JSON.stringify(securePayload);
    navigator.sendBeacon('/api/logs', secureBody);
  }

  private async sendWithFetch(logs: QueuedLogEntry[]): Promise<void> {
    const { body, headers } = await this.prepareRequestBody(logs);
    const authenticatedHeaders = await this.authManager.attachAuth(headers);

    const response = await fetch('/api/logs', {
      method: 'POST',
      headers: authenticatedHeaders,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  private async handleSendError(
    error: unknown,
    logs: QueuedLogEntry[],
    isPageUnload: boolean
  ): Promise<void> {
    const errorInfo = this.categorizeError(error, isPageUnload);

    if (isPageUnload) {
      return; // Don't retry on page unload
    }

    const retryLogs = this.createRetryLogs(logs, errorInfo);
    if (retryLogs.length > 0) {
      this.scheduleRetry(retryLogs);
    }
  }

  private createRetryLogs(
    logs: QueuedLogEntry[],
    errorInfo: { category: string; message: string }
  ): QueuedLogEntry[] {
    return logs.map((entry) => ({
      ...entry,
      retryCount: entry.retryCount + 1,
      lastError: {
        message: errorInfo.message,
        category: errorInfo.category,
        timestamp: new Date().toISOString(),
      },
    }));
  }

  private scheduleRetry(logs: QueuedLogEntry[]): void {
    setTimeout(
      () => {
        if (this.isOnline) {
          this.logQueue.unshift(...logs);
          this.processQueue();
        }
      },
      this.config.retryDelay *
        Math.pow(EXPONENTIAL_BACKOFF_BASE, (logs[0]?.retryCount || 1) - 1)
    );
  }

  /**
   * Categorize errors for better handling and debugging
   */
  private categorizeError(
    error: unknown,
    isPageUnload: boolean
  ): {
    category: string;
    message: string;
    isRetryable: boolean;
  } {
    if (error instanceof Error) {
      // Network errors
      if (
        error.message.includes('fetch') ||
        error.message.includes('network')
      ) {
        return {
          category: 'NETWORK_ERROR',
          message: error.message,
          isRetryable: !isPageUnload,
        };
      }

      // HTTP errors
      if (error.message.includes('HTTP')) {
        const statusMatch = error.message.match(/HTTP (\d+)/);
        const status =
          statusMatch && statusMatch[1] ? parseInt(statusMatch[1]) : 0;

        if (status >= 400 && status < 500) {
          return {
            category: 'CLIENT_ERROR',
            message: error.message,
            isRetryable: false,
          };
        }

        if (status >= 500) {
          return {
            category: 'SERVER_ERROR',
            message: error.message,
            isRetryable: !isPageUnload,
          };
        }
      }

      // Timeout errors
      if (
        error.message.includes('timeout') ||
        error.message.includes('Timeout')
      ) {
        return {
          category: 'TIMEOUT_ERROR',
          message: error.message,
          isRetryable: !isPageUnload,
        };
      }

      // JSON parsing errors
      if (error.message.includes('JSON') || error.message.includes('parse')) {
        return {
          category: 'PARSE_ERROR',
          message: error.message,
          isRetryable: false,
        };
      }

      // Generic error with message
      return {
        category: 'UNKNOWN_ERROR',
        message: error.message,
        isRetryable: !isPageUnload,
      };
    }

    // Non-Error objects
    return {
      category: 'INVALID_ERROR_TYPE',
      message: typeof error === 'string' ? error : 'Unknown error',
      isRetryable: false,
    };
  }

  private log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>
  ): void {
    const entry = this.createLogEntry(level, message, metadata);

    if (this.isOnline) {
      this.addToQueue(entry);
    } else {
      // Store for later when online
      this.addToQueue(entry);
    }
  }

  logDebug(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  logInfo(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  logWarning(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.WARNING, message, metadata);
  }

  logError(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, metadata);
  }

  // Public methods for testing and monitoring
  getQueueSize(): number {
    return this.logQueue.length;
  }

  isLoggerOnline(): boolean {
    return this.isOnline;
  }

  async flush(): Promise<void> {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    await this.processQueue();
  }

  /**
   * Cleanup method to prevent memory leaks
   * Should be called when the logger is no longer needed
   */
  cleanup(): void {
    // Clear batch timer
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    // Remove event listeners with proper function references
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.onlineHandler);
      window.removeEventListener('offline', this.offlineHandler);
      window.removeEventListener('beforeunload', this.beforeUnloadHandler);
      document.removeEventListener(
        'visibilitychange',
        this.visibilityChangeHandler
      );
    }

    // Clear queue to free memory
    this.logQueue = [];
  }

  // Cleanup method for testing
  static resetInstance(): void {
    if (RemoteLoggerAdapter.instance) {
      // Call cleanup to remove event listeners and clear timers
      RemoteLoggerAdapter.instance.cleanup();
    }
    RemoteLoggerAdapter.instance = null;
  }
}
