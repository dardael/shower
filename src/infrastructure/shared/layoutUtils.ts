import { initializeDatabase } from './databaseInitialization';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';

// Database initialization timeout configuration
const DATABASE_INIT_TIMEOUT = parseInt(
  process.env.DATABASE_INIT_TIMEOUT || '3000',
  10
);

/**
 * Shared utility function for database initialization in layouts
 * Provides consistent database initialization with proper error handling and timeout
 */
export async function initializeDatabaseForLayout(): Promise<void> {
  try {
    await Promise.race([
      initializeDatabase(),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Database initialization timeout')),
          DATABASE_INIT_TIMEOUT
        )
      ),
    ]);
  } catch (error) {
    try {
      const logger = container.resolve<Logger>('Logger');
      logger.logErrorWithObject(
        error,
        'Database initialization failed or timed out in layout',
        { timeout: DATABASE_INIT_TIMEOUT }
      );
    } catch {
      // Logger not available, continue silently
    }
    // Continue without database to allow app to start
  }
}

/**
 * Shared utility function to fetch website name from API
 * Used by both root and admin layouts to avoid code duplication
 */
export async function fetchWebsiteName(suffix?: string): Promise<string> {
  // Only fetch during runtime, not during build
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return suffix ? `Shower${suffix}` : 'Shower'; // Default during build
  }

  try {
    const baseUrl = process.env.SHOWER_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/settings/name`, {
      cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const baseName = data.name || 'Shower';
    return suffix ? `${baseName}${suffix}` : baseName;
  } catch (error) {
    const logger = container.resolve<Logger>('Logger');
    logger.logErrorWithObject(error, 'Failed to fetch website name');
    return suffix ? `Shower${suffix}` : 'Shower'; // Default fallback
  }
}

/**
 * Shared utility function to fetch website icon from API
 * Used by both root and admin layouts to avoid code duplication
 */
export async function fetchWebsiteIcon(): Promise<string | null> {
  // Only fetch during runtime, not during build
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return null; // Default during build
  }

  try {
    const baseUrl = process.env.SHOWER_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/settings/icon`, {
      cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.icon?.url || null;
  } catch (error) {
    const logger = container.resolve<Logger>('Logger');
    logger.logErrorWithObject(error, 'Failed to fetch website icon');
    return null; // Default fallback
  }
}
