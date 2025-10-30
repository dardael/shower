/**
 * System Console Logger
 *
 * A minimal console logger specifically for system-level messages where
 * the main Logger cannot be used due to circular dependencies or
 * initialization timing issues.
 *
 * This should ONLY be used for:
 * - System initialization messages
 * - Fallback logging when main Logger is unavailable
 * - Critical error reporting in edge cases
 *
 * NOT for application-level logging.
 */
export class SystemConsoleLogger {
  private static instance: SystemConsoleLogger;

  private constructor() {}

  static getInstance(): SystemConsoleLogger {
    if (!SystemConsoleLogger.instance) {
      SystemConsoleLogger.instance = new SystemConsoleLogger();
    }
    return SystemConsoleLogger.instance;
  }

  /**
   * Log system-level warning
   */
  warn(message: string, metadata?: Record<string, unknown>): void {
    const formattedMessage = this.formatMessage('WARN', message, metadata);
    console.warn(formattedMessage);
  }

  /**
   * Log system-level error
   */
  error(message: string, metadata?: Record<string, unknown>): void {
    const formattedMessage = this.formatMessage('ERROR', message, metadata);
    console.error(formattedMessage);
  }

  /**
   * Log system-level info
   */
  info(message: string, metadata?: Record<string, unknown>): void {
    const formattedMessage = this.formatMessage('INFO', message, metadata);
    console.info(formattedMessage);
  }

  /**
   * Log system-level debug
   */
  debug(message: string, metadata?: Record<string, unknown>): void {
    const formattedMessage = this.formatMessage('DEBUG', message, metadata);
    console.debug(formattedMessage);
  }

  /**
   * Format message with metadata
   */
  private formatMessage(
    level: string,
    message: string,
    metadata?: Record<string, unknown>
  ): string {
    const timestamp = new Date().toISOString();
    const metadataStr = metadata ? ` ${JSON.stringify(metadata)}` : '';
    return `[${timestamp}] [SYSTEM-${level}] ${message}${metadataStr}`;
  }

  /**
   * Reset singleton instance (for testing)
   */
  static resetInstance(): void {
    SystemConsoleLogger.instance = null as unknown as SystemConsoleLogger;
  }
}
