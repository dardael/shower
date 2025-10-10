import { DatabaseConnection } from './databaseConnection';

let isInitialized = false;

export async function initializeDatabase(): Promise<void> {
  if (isInitialized) {
    return;
  }

  try {
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect();
    isInitialized = true;
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}
