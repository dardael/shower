import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { container } from '@/infrastructure/container';
import type { ILogger } from '@/application/shared/ILogger';
import { UnifiedLogger } from '@/application/shared/UnifiedLogger';
import { ContextualLogger } from '@/application/shared/ContextualLogger';

export interface RequestContext {
  requestId: string;
  userId?: string;
  startTime: number;
  logger: UnifiedLogger;
  contextualLogger: ContextualLogger;
}

declare global {
  var __requestContext: RequestContext | undefined;
}

export function createRequestContext(request: NextRequest): RequestContext {
  const requestId = request.headers.get('x-request-id') || randomUUID();
  const userId = request.headers.get('x-user-id') || undefined;
  const startTime = Date.now();

  const baseLogger = container.resolve<ILogger>('ILogger');
  const unifiedLogger = new UnifiedLogger(baseLogger);
  const contextualLogger = unifiedLogger.withContext({
    requestId,
    userId,
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent') || undefined,
  });

  return {
    requestId,
    userId,
    startTime,
    logger: unifiedLogger,
    contextualLogger,
  };
}

export function getRequestContext(): RequestContext | undefined {
  return globalThis.__requestContext;
}

export function setRequestContext(context: RequestContext): void {
  globalThis.__requestContext = context;
}

export function withRequestContext<T>(
  request: NextRequest,
  fn: (context: RequestContext) => Promise<T>
): Promise<T> {
  const context = createRequestContext(request);
  setRequestContext(context);

  return fn(context).finally(() => {
    globalThis.__requestContext = undefined;
  });
}

// Middleware for API routes
export function requestMiddleware(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    return withRequestContext(request, async (context) => {
      const startTime = Date.now();

      try {
        context.logger.logApiRequest(
          request.method,
          new URL(request.url).pathname,
          context.userId
        );

        const response = await handler(request);

        const duration = Date.now() - startTime;
        context.logger.logApiResponse(
          request.method,
          new URL(request.url).pathname,
          response.status,
          duration
        );

        // Add request ID to response headers
        response.headers.set('x-request-id', context.requestId);

        return response;
      } catch (error) {
        const duration = Date.now() - startTime;
        context.logger.logError(error as Error, 'Unhandled request error', {
          method: request.method,
          url: new URL(request.url).pathname,
          duration,
        });

        throw error;
      }
    });
  };
}
