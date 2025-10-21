import { DatabaseConnection } from './databaseConnection';
import { container } from '@/infrastructure/container';
import type { ILogger } from '@/application/shared/ILogger';
import { LogMessage } from '@/application/shared/LogMessage';
import { LogLevel } from '@/domain/shared/value-objects/LogLevel';

let isInitialized = false;

export async function initializeDatabase(): Promise<void> {
  if (isInitialized) {
    return;
  }

  try {
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect();
    isInitialized = true;
    const logger = container.resolve<ILogger>('ILogger');
    new LogMessage(logger).execute(
      LogLevel.INFO,
      'Database initialized successfully'
    );
  } catch (error) {
    const logger = container.resolve<ILogger>('ILogger');
    new LogMessage(logger).execute(
      LogLevel.ERROR,
      'Failed to initialize database',
      { error }
    );
    throw error;
  }
}
