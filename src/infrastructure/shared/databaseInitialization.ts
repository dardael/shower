import { DatabaseConnection } from './databaseConnection';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';

let isInitialized = false;

export async function initializeDatabase(): Promise<void> {
  if (isInitialized) {
    return;
  }

  try {
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect();
    isInitialized = true;
    // Only log if logger is available to avoid circular dependency
    try {
      const logger = container.resolve<Logger>('Logger');
      logger.info('Database initialized successfully');
    } catch {
      // Logger not available, skip logging
      console.log('Database initialized successfully');
    }
  } catch (error) {
    // Only log if logger is available to avoid circular dependency
    try {
      const logger = container.resolve<Logger>('Logger');
      logger.logError(error, 'Failed to initialize database');
    } catch {
      // Logger not available, use console
      console.error('Failed to initialize database:', error);
    }
    throw error;
  }
}
