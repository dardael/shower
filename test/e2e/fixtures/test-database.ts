import mongoose from 'mongoose';
import { DatabaseConnection } from '@/infrastructure/shared/databaseConnection';

/**
 * Test database utility for managing the test database in e2e tests
 * Extends the existing DatabaseConnection with test-specific functionality
 */
export class TestDatabase {
  private static dbConnection: DatabaseConnection;

  /**
   * Connect to the test database
   */
  public static async connect(): Promise<void> {
    // Use the singleton pattern from the existing DatabaseConnection
    this.dbConnection = DatabaseConnection.getInstance();
    await this.dbConnection.connect();

    // Verify we're connected to the test database to prevent accidental data corruption
    const dbName = mongoose.connection.name;
    if (dbName !== 'shower_test') {
      throw new Error(
        `Connected to wrong database: ${dbName}. Expected to connect to 'shower_test'`
      );
    }
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database connection is not ready');
    }
  }

  /**
   * Disconnect from the test database
   */
  public static async disconnect(): Promise<void> {
    await this.dbConnection.disconnect();
  }

  /**
   * Clean all collections in the test database
   */
  public static async cleanDatabase(): Promise<void> {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      throw new Error('Not connected to database. Call connect() first.');
    }
    await mongoose.connection.db?.dropDatabase();
  }
}
