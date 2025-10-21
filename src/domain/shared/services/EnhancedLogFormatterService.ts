import { LogLevel } from '@/domain/shared/value-objects/LogLevel';

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface FormatterOptions {
  includeStackTrace?: boolean;
  maxMetadataSize?: number;
  truncateLongStrings?: boolean;
  colorizeConsole?: boolean;
}

export class EnhancedLogFormatterService {
  private readonly includeStackTrace: boolean;
  private readonly maxMetadataSize: number;
  private readonly truncateLongStrings: boolean;
  private readonly colorizeConsole: boolean;

  constructor(options: FormatterOptions = {}) {
    this.includeStackTrace = options.includeStackTrace ?? false;
    this.maxMetadataSize = options.maxMetadataSize ?? 10000; // 10KB
    this.truncateLongStrings = options.truncateLongStrings ?? true;
    this.colorizeConsole = options.colorizeConsole ?? false;
  }

  format(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>
  ): string {
    const timestamp = new Date().toISOString();

    // Build base log entry
    const logEntry: LogEntry = {
      timestamp: new Date(timestamp),
      level,
      message,
      metadata: this.sanitizeMetadata(metadata),
    };

    // Format based on environment
    if (process.env.NODE_ENV === 'production') {
      return this.formatJson(logEntry);
    } else {
      return this.formatHumanReadable(logEntry);
    }
  }

  private formatJson(entry: LogEntry): string {
    const jsonEntry = {
      timestamp: entry.timestamp.toISOString(),
      level: entry.level.toString(),
      message: entry.message,
      ...entry.metadata,
    };

    // Remove undefined values
    Object.keys(jsonEntry).forEach((key) => {
      if (jsonEntry[key as keyof typeof jsonEntry] === undefined) {
        delete jsonEntry[key as keyof typeof jsonEntry];
      }
    });

    try {
      return JSON.stringify(jsonEntry);
    } catch (error) {
      // Fallback for circular references
      return JSON.stringify({
        timestamp: entry.timestamp.toISOString(),
        level: entry.level.toString(),
        message: entry.message,
        metadata: '[Circular reference or too large]',
        serializationError:
          error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private formatHumanReadable(entry: LogEntry): string {
    const timestamp = entry.timestamp
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19);

    const levelStr = this.colorizeLevel(
      entry.level.toString().toUpperCase().padEnd(7)
    );
    let logLine = `[${timestamp}] ${levelStr} ${entry.message}`;

    // Add metadata if present
    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      const metadataStr = this.formatMetadataForConsole(entry.metadata);
      logLine += ` ${metadataStr}`;
    }

    return logLine;
  }

  private colorizeLevel(level: string): string {
    if (!this.colorizeConsole || !process.stdout.isTTY) {
      return level;
    }

    const colors = {
      DEBUG: '\x1b[36m', // Cyan
      INFO: '\x1b[32m', // Green
      WARNING: '\x1b[33m', // Yellow
      ERROR: '\x1b[31m', // Red
    };

    const reset = '\x1b[0m';
    const color = colors[level.trim() as keyof typeof colors] || '';
    return `${color}${level}${reset}`;
  }

  private sanitizeMetadata(
    metadata?: Record<string, unknown>
  ): Record<string, unknown> | undefined {
    if (!metadata) {
      return undefined;
    }

    try {
      const serialized = JSON.stringify(metadata);
      if (serialized.length > this.maxMetadataSize) {
        return {
          metadata: '[Metadata too large]',
          originalSize: serialized.length,
        };
      }
      return metadata;
    } catch {
      return { metadata: '[Serialization failed]' };
    }
  }

  private formatMetadataForConsole(metadata: Record<string, unknown>): string {
    try {
      const formatted: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(metadata)) {
        formatted[key] = this.formatValue(value);
      }

      return JSON.stringify(formatted, null, 0);
    } catch {
      return '[Invalid metadata]';
    }
  }

  private formatValue(value: unknown): unknown {
    if (value instanceof Error) {
      const errorObj: Record<string, unknown> = {
        name: value.name,
        message: value.message,
      };

      if (this.includeStackTrace && value.stack) {
        errorObj.stack = value.stack;
      }

      return errorObj;
    }

    if (typeof value === 'object' && value !== null) {
      // Handle circular references and large objects
      try {
        const serialized = JSON.stringify(value);
        if (serialized.length > 1000) {
          return this.truncateLongStrings
            ? `[Large object: ${serialized.length} bytes]`
            : value;
        }
        return JSON.parse(serialized);
      } catch {
        return '[Object]';
      }
    }

    if (
      typeof value === 'string' &&
      this.truncateLongStrings &&
      value.length > 200
    ) {
      return value.substring(0, 200) + '... [truncated]';
    }

    return value;
  }

  // Specialized formatters for different log types
  formatApiRequest(
    method: string,
    url: string,
    userId?: string,
    metadata?: Record<string, unknown>
  ): string {
    return this.format(LogLevel.INFO, `API Request: ${method} ${url}`, {
      ...metadata,
      type: 'api_request',
      method,
      url,
      userId,
    });
  }

  formatApiResponse(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    metadata?: Record<string, unknown>
  ): string {
    const level = statusCode >= 400 ? LogLevel.WARNING : LogLevel.INFO;
    return this.format(
      level,
      `API Response: ${method} ${url} - ${statusCode} (${duration}ms)`,
      {
        ...metadata,
        type: 'api_response',
        method,
        url,
        statusCode,
        duration,
      }
    );
  }

  formatError(
    error: Error,
    message?: string,
    metadata?: Record<string, unknown>
  ): string {
    return this.format(LogLevel.ERROR, message || error.message, {
      ...metadata,
      type: 'error',
      error: {
        name: error.name,
        message: error.message,
        stack: this.includeStackTrace ? error.stack : undefined,
      },
    });
  }

  formatPerformance(
    operation: string,
    duration: number,
    metadata?: Record<string, unknown>
  ): string {
    const level = duration > 1000 ? LogLevel.WARNING : LogLevel.INFO;
    return this.format(level, `Performance: ${operation} took ${duration}ms`, {
      ...metadata,
      type: 'performance',
      operation,
      duration,
    });
  }

  formatSecurity(
    event: string,
    userId?: string,
    ip?: string,
    metadata?: Record<string, unknown>
  ): string {
    return this.format(LogLevel.WARNING, `Security Event: ${event}`, {
      ...metadata,
      type: 'security',
      event,
      userId,
      ip,
      timestamp: new Date().toISOString(),
    });
  }
}
