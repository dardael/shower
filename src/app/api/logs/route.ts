import { NextRequest, NextResponse } from 'next/server';
import { withApi } from '@/infrastructure/shared/apiWrapper';
import { Logger } from '@/application/shared/Logger';
import { container } from '@/infrastructure/container';
import type { ClientLogEntry } from '@/infrastructure/shared/types/LogEntry';
import { ClientLogAuthenticationService } from '@/infrastructure/shared/services/ClientLogAuthenticationService';
import { ClientLogProcessor } from '@/infrastructure/shared/services/ClientLogProcessor';
import { SystemConsoleLogger } from '@/infrastructure/shared/utils/SystemConsoleLogger';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'); // 1 minute default
const RATE_LIMIT_MAX_REQUESTS = parseInt(
  process.env.RATE_LIMIT_MAX_REQUESTS || '100'
); // 100 requests per minute default

/**
 * RATE LIMITING IMPLEMENTATION:
 *
 * MEMORY STORAGE:
 * - Simple in-memory rate limiting for single-instance deployments
 * - Rate limits reset on server restart
 * - Suitable for development and single-server production
 */

// Rate limiting storage interface
interface RateLimitStore {
  checkRateLimit(key: string): boolean;
  cleanup?(): void;
  destroy?(): void;
}

// Memory-based rate limiting (default)
class MemoryRateLimiter implements RateLimitStore {
  private store: Map<string, { count: number; resetTime: number }>;

  constructor() {
    this.store = new Map();
  }

  checkRateLimit(key: string): boolean {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || now > record.resetTime) {
      this.store.set(key, {
        count: 1,
        resetTime: now + RATE_LIMIT_WINDOW,
      });
      return true;
    }

    if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
      return false;
    }

    record.count++;
    return true;
  }

  cleanup(): void {
    const now = Date.now();
    const beforeCount = this.store.size;
    const systemLogger = SystemConsoleLogger.getInstance();

    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime) {
        this.store.delete(key);
      }
    }

    const afterCount = this.store.size;
    if (beforeCount !== afterCount && process.env.NODE_ENV === 'development') {
      systemLogger.debug('MEMORY RATE LIMITING: Cleanup completed', {
        removed: beforeCount - afterCount,
        active: afterCount,
        operation: 'cleanup',
      });
    }
  }

  destroy(): void {
    this.store.clear();
  }
}

// Initialize memory-based rate limiter
const rateLimitStore = new MemoryRateLimiter();

interface ClientLogBatch {
  logs: ClientLogEntry[];
  source: 'client';
  timestamp: string;
  clientInfo: {
    userAgent: string;
    ip: string;
    timestamp: string;
  };
}

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return `logs:${ip}`;
}

function generateBatchId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function checkRateLimit(key: string): boolean {
  return rateLimitStore.checkRateLimit(key);
}

/**
 * Deep clone an object using structuredClone with fallback
 * More efficient than JSON.parse(JSON.stringify())
 */
function deepClone<T>(obj: T): T {
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

function sanitizeLogEntry(entry: ClientLogEntry): ClientLogEntry {
  return {
    level: entry.level || 'info',
    message: entry.message ? entry.message.substring(0, 1000) : '', // Max 1000 chars
    metadata: entry.metadata ? deepClone(entry.metadata) : {},
    timestamp: entry.timestamp,
    clientContext: entry.clientContext
      ? {
          userAgent: entry.clientContext.userAgent?.substring(0, 500),
          screenResolution: entry.clientContext.screenResolution?.substring(
            0,
            50
          ),
          timezone: entry.clientContext.timezone?.substring(0, 100),
          language: entry.clientContext.language?.substring(0, 10),
          sessionId: entry.clientContext.sessionId?.substring(0, 100),
        }
      : undefined,
  };
}

export const POST = withApi(
  async (request: NextRequest) => {
    const startTime = Date.now();
    const rateLimitKey = getRateLimitKey(request);

    // Initialize authentication service (no circular dependency)
    const authService = ClientLogAuthenticationService.getInstance();

    // Note: Logger resolved after initial validation to avoid circular dependency
    let logger: Logger | null = null;

    try {
      // Authenticate request using dedicated service
      const authResult = await authService.authenticateRequest(request);
      if (!authResult.valid) {
        // Try to log authentication failure if logger is available
        try {
          logger = container.resolve<Logger>('Logger');
          logger.warn('Client log authentication failed', {
            error: authResult.error,
            ip: rateLimitKey.replace('logs:', ''),
            userAgent: request.headers.get('user-agent'),
          });
        } catch {
          // Logger not available, continue without logging
        }

        return NextResponse.json(
          { error: 'Authentication failed', details: authResult.error },
          { status: 401 }
        );
      }
      // Request size validation
      const MAX_REQUEST_SIZE = 1024 * 1024; // 1MB
      const contentLength = request.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > MAX_REQUEST_SIZE) {
        return NextResponse.json(
          { error: 'Request too large' },
          { status: 413 }
        );
      }

      // Rate limiting
      if (!checkRateLimit(rateLimitKey)) {
        // Try to get logger for rate limit warning, but don't fail if it's not available
        try {
          logger = container.resolve<Logger>('Logger');
          logger.warn('Rate limit exceeded for logging endpoint', {
            ip: rateLimitKey.replace('logs:', ''),
            userAgent: request.headers.get('user-agent'),
          });
        } catch {
          // Logger not available, continue without logging
        }

        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { status: 429 }
        );
      }

      // Parse request body (handle compressed payloads and secure auth format)
      let body: Record<string, unknown> | unknown[];
      const contentEncoding = request.headers.get('content-encoding');
      const isCompressed = request.headers.get('x-compressed') === 'true';

      try {
        if (isCompressed && contentEncoding === 'gzip') {
          // Handle compressed payload
          const requestBody = await request.arrayBuffer();
          const compressed = new Uint8Array(requestBody);

          // Decompress using Node.js zlib
          const { gunzip } = await import('zlib');
          const { promisify } = await import('util');
          const gunzipAsync = promisify(gunzip);

          const decompressed = await gunzipAsync(compressed);
          const parsedBody = JSON.parse(decompressed.toString());

          // Check if this is a secure payload with auth
          if (
            parsedBody &&
            typeof parsedBody === 'object' &&
            'logs' in parsedBody &&
            'auth' in parsedBody
          ) {
            body = parsedBody.logs;
          } else {
            body = parsedBody;
          }

          // Note: Logger might not be available yet, skip debug logging for compressed payload
        } else {
          // Regular JSON payload
          const parsedBody = await request.json();

          // Check if this is a secure payload with auth
          if (
            parsedBody &&
            typeof parsedBody === 'object' &&
            'logs' in parsedBody &&
            'auth' in parsedBody
          ) {
            body = parsedBody.logs;
          } else {
            body = parsedBody;
          }
        }
      } catch {
        return NextResponse.json(
          { error: 'Invalid request body format' },
          { status: 400 }
        );
      }

      // Validate request structure
      if (!body || typeof body !== 'object') {
        return NextResponse.json(
          { error: 'Invalid request body' },
          { status: 400 }
        );
      }

      // Handle single log entry or batch
      const logs = Array.isArray(body)
        ? body
        : body &&
            typeof body === 'object' &&
            'logs' in body &&
            Array.isArray(body.logs)
          ? body.logs
          : [body];

      if (!Array.isArray(logs) || logs.length === 0) {
        return NextResponse.json(
          { error: 'No logs provided' },
          { status: 400 }
        );
      }

      // Limit batch size
      if (logs.length > 50) {
        return NextResponse.json(
          { error: 'Batch size too large (max 50 entries)' },
          { status: 400 }
        );
      }

      // Process each log entry
      const processedLogs: ClientLogEntry[] = [];
      for (const entry of logs) {
        if (entry && typeof entry === 'object' && entry.message) {
          const sanitized = sanitizeLogEntry(entry);
          processedLogs.push(sanitized);
        }
      }

      if (processedLogs.length === 0) {
        return NextResponse.json(
          { error: 'No valid log entries found' },
          { status: 400 }
        );
      }

      // Create enriched log batch
      const logBatch: ClientLogBatch = {
        logs: processedLogs,
        source: 'client',
        timestamp: new Date().toISOString(),
        clientInfo: {
          userAgent: request.headers.get('user-agent') || 'unknown',
          ip: rateLimitKey.replace('logs:', ''),
          timestamp: new Date().toISOString(),
        },
      };

      // Use ClientLogProcessor to handle log processing without circular dependency
      const logProcessor = ClientLogProcessor.getInstance();
      const result = await logProcessor.processLogBatch(
        processedLogs,
        logBatch.clientInfo
      );

      // Try to get logger for API response logging (optional)
      try {
        logger = container.resolve<Logger>('Logger');
        const duration = Date.now() - startTime;
        logger.logApiResponse('POST', '/api/logs', 200, duration, {
          logCount: result.processed,
          clientIp: logBatch.clientInfo.ip,
          errors: result.errors.length,
        });
      } catch {
        // Logger not available for response logging - continue
      }

      const batchId = generateBatchId();

      return NextResponse.json({
        success: true,
        processed: result.processed,
        errors: result.errors,
        batchId,
      });
    } catch (error) {
      const duration = Date.now() - startTime;

      // Try to log error if logger is available
      try {
        if (!logger) {
          logger = container.resolve<Logger>('Logger');
        }
        logger.logErrorWithObject(
          error instanceof Error ? error : new Error(String(error)),
          'Failed to process client logs',
          {
            method: 'POST',
            url: '/api/logs',
            duration,
            userAgent: request.headers.get('user-agent'),
            ip: rateLimitKey.replace('logs:', ''),
          }
        );

        logger.logApiResponse('POST', '/api/logs', 500, duration);
      } catch {
        // Logger not available, continue without logging
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
  { requireAuth: false } // Uses custom authentication to avoid circular dependency
);

// Health check endpoint for logging API
export const GET = withApi(
  async () => {
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      rateLimitStore: 'memory',
    });
  },
  { requireAuth: false }
);

// Clean up old rate limit records periodically with proper cleanup
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

if (typeof setInterval !== 'undefined') {
  cleanupTimer = setInterval(() => {
    rateLimitStore.cleanup();
  }, RATE_LIMIT_WINDOW);

  // Cleanup on process exit
  const cleanup = () => {
    if (cleanupTimer) {
      clearInterval(cleanupTimer);
      cleanupTimer = null;
    }
    rateLimitStore.destroy();
  };

  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);
  process.on('beforeExit', cleanup);
}
