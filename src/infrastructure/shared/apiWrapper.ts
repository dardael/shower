import { NextRequest, NextResponse } from 'next/server';
import { DatabaseConnection } from '@/infrastructure/shared/databaseConnection';
import { authenticateRequest } from '@/infrastructure/auth/ApiAuthentication';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';

type NextRouteHandler<T = unknown> = (request: NextRequest) => Promise<T>;
type NextRouteHandlerWithParams<T = unknown> = (
  request: NextRequest,
  { params }: { params: Record<string, unknown> }
) => Promise<T>;

interface ApiWrapperOptions {
  requireAuth?: boolean;
}

/**
 * Higher-order function that wraps Next.js API route handlers with database connection and optional authentication
 * @param handler - The route handler function to wrap
 * @param options - Configuration options for the wrapper
 * @returns A new handler function that connects to database and optionally authenticates before executing original handler
 */
export function withApi<T = unknown>(
  handler: NextRouteHandler<T>,
  options: ApiWrapperOptions = {}
): NextRouteHandler<T> {
  return async (request: NextRequest): Promise<T> => {
    try {
      // Connect to database
      const dbConnection = DatabaseConnection.getInstance();
      await dbConnection.connect();

      // Check authentication if required
      if (options.requireAuth) {
        const authResult = await authenticateRequest(request);
        if (authResult) {
          return authResult as T;
        }
      }

      // Execute original handler
      return await handler(request);
    } catch (error) {
      // Log error if logger is available
      try {
        const logger = container.resolve<Logger>('Logger');
        logger.logErrorWithObject(error, 'API wrapper failed', {
          requireAuth: options.requireAuth,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      } catch {
        // Logger not available, continue silently
      }

      // Return appropriate error response
      if (error instanceof Error) {
        return NextResponse.json(
          { error: 'Internal server error', details: error.message },
          { status: 500 }
        ) as T;
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      ) as T;
    }
  };
}

/**
 * Higher-order function that wraps Next.js API route handlers with database connection and optional authentication
 * For routes that receive params (dynamic routes)
 * @param handler - The route handler function to wrap
 * @param options - Configuration options for the wrapper
 * @returns A new handler function that connects to database and optionally authenticates before executing original handler
 */
export function withApiWithParams<T = unknown>(
  handler: NextRouteHandlerWithParams<T>,
  options: ApiWrapperOptions = {}
): NextRouteHandlerWithParams<T> {
  return async (
    request: NextRequest,
    { params }: { params: Record<string, unknown> }
  ): Promise<T> => {
    try {
      // Connect to database
      const dbConnection = DatabaseConnection.getInstance();
      await dbConnection.connect();

      // Check authentication if required
      if (options.requireAuth) {
        const authResult = await authenticateRequest(request);
        if (authResult) {
          return authResult as T;
        }
      }

      // Execute original handler
      return await handler(request, { params });
    } catch (error) {
      // Log error if logger is available
      try {
        const logger = container.resolve<Logger>('Logger');
        logger.logErrorWithObject(error, 'API wrapper failed', {
          requireAuth: options.requireAuth,
          params,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      } catch {
        // Logger not available, continue silently
      }

      // Return appropriate error response
      if (error instanceof Error) {
        return NextResponse.json(
          { error: 'Internal server error', details: error.message },
          { status: 500 }
        ) as T;
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      ) as T;
    }
  };
}
