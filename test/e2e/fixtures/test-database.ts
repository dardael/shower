import mongoose from 'mongoose';

// Import models to ensure they are registered with Mongoose
import '@/infrastructure/settings/models/WebsiteSettingsModel';
import '@/infrastructure/settings/models/SocialNetworkModel';

/**
 * Connection pool configuration for parallel test execution
 */
interface ConnectionPool {
  maxConnections: number;
  timeout: number;
}

/**
 * Test database utility for managing the test database in e2e tests
 * Enhanced with connection pooling and collection-specific cleanup
 */
export class TestDatabase {
  private static isConnected = false;
  private static connectionRefCount = 0;
  private static connectionPool: ConnectionPool = {
    maxConnections: 8,
    timeout: 30000, // 30 seconds
  };

  /**
   * Connect to the test database with connection pooling
   */
  public static async connect(): Promise<void> {
    if (this.isConnected) {
      this.connectionRefCount++;
      return;
    }

    const MONGODB_URI =
      process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/shower_test';

    // Configure connection pooling
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: this.connectionPool.maxConnections,
      serverSelectionTimeoutMS: this.connectionPool.timeout,
      socketTimeoutMS: this.connectionPool.timeout,
    });

    this.isConnected = true;
    this.connectionRefCount = 1;

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
    if (!this.isConnected) {
      return;
    }

    this.connectionRefCount--;

    // Only disconnect when all references are released
    if (this.connectionRefCount <= 0) {
      await mongoose.disconnect();
      this.isConnected = false;
      this.connectionRefCount = 0;
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

  /**
   * Clean a specific collection in the test database
   * @param collectionName - Name of the collection to clean
   */
  public static async cleanCollection(collectionName: string): Promise<void> {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      throw new Error('Not connected to database. Call connect() first.');
    }

    const collection = mongoose.connection.db?.collection(collectionName);
    if (!collection) {
      throw new Error(`Collection '${collectionName}' not found`);
    }

    await collection.deleteMany({});
  }

  /**
   * Clean multiple collections in the test database
   * @param collectionNames - Array of collection names to clean
   */
  public static async cleanCollections(
    collectionNames: string[]
  ): Promise<void> {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      throw new Error('Not connected to database. Call connect() first.');
    }

    const cleanupPromises = collectionNames.map(async (collectionName) => {
      try {
        await this.cleanCollection(collectionName);
      } catch {
        // Log error but continue with other collections
        // Failed to clean collection, continuing with others
      }
    });

    await Promise.all(cleanupPromises);
  }

  /**
   * Get connection pool status for monitoring
   */
  public static getConnectionPoolStatus(): ConnectionPool {
    return { ...this.connectionPool };
  }

  /**
   * Check if a collection exists in the database
   * @param collectionName - Name of the collection to check
   */
  public static async collectionExists(
    collectionName: string
  ): Promise<boolean> {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      throw new Error('Not connected to database. Call connect() first.');
    }

    const collections = await mongoose.connection.db
      ?.listCollections()
      .toArray();
    return (
      collections?.some((collection) => collection.name === collectionName) ??
      false
    );
  }

  /**
   * Get count of documents in a collection
   * @param collectionName - Name of the collection
   */
  public static async getCollectionCount(
    collectionName: string
  ): Promise<number> {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      throw new Error('Not connected to database. Call connect() first.');
    }

    const collection = mongoose.connection.db?.collection(collectionName);
    if (!collection) {
      throw new Error(`Collection '${collectionName}' not found`);
    }

    return await collection.countDocuments();
  }

  /**
   * Wait for database operations to complete by checking connection state
   * @param timeout - Maximum time to wait in milliseconds
   */
  public static async waitForOperationsComplete(timeout = 5000): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (mongoose.connection.readyState === 1) {
        // Check if there are no pending operations
        const admin = mongoose.connection.db?.admin();
        if (admin) {
          try {
            const serverStatus = await admin.serverStatus();
            const activeOperations = serverStatus?.connections?.active || 0;
            if (activeOperations <= 1) {
              // Allow for our own connection
              return;
            }
          } catch {
            // If we can't check server status, assume operations are complete
            return;
          }
        }
      }

      // Wait a bit before checking again
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // If we timeout, don't fail - just continue
    // Database operations may not have completed within timeout
  }
}
