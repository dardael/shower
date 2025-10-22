import mongoose from 'mongoose';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    const uri = process.env.MONGODB_URI as string;

    try {
      // Connect using Mongoose for the application
      await mongoose.connect(uri);

      this.isConnected = true;
      try {
        const logger = container.resolve<Logger>('Logger');
        logger.info('Connected to MongoDB');
      } catch {
        console.log('Connected to MongoDB');
      }
    } catch (error) {
      try {
        const logger = container.resolve<Logger>('Logger');
        logger.logError(error, 'Failed to connect to MongoDB');
      } catch {
        console.error('Failed to connect to MongoDB:', error);
      }
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    await mongoose.disconnect();

    this.isConnected = false;
    try {
      const logger = container.resolve<Logger>('Logger');
      logger.info('Disconnected from MongoDB');
    } catch {
      console.log('Disconnected from MongoDB');
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
