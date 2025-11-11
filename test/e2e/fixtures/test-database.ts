import mongoose from 'mongoose';

// Import models to ensure they are registered with Mongoose
import '@/infrastructure/settings/models/WebsiteSettingsModel';
import '@/infrastructure/settings/models/SocialNetworkModel';

/**
 * Test database utility for managing the test database in e2e tests
 * Simplified version to avoid TypeScript decorator issues
 */
export class TestDatabase {
  private static isConnected = false;

  /**
   * Connect to the test database
   */
  public static async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    const MONGODB_URI =
      process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/shower_test';

    await mongoose.connect(MONGODB_URI);
    this.isConnected = true;

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
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
    }
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
