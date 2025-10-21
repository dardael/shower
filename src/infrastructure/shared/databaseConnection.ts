import mongoose from 'mongoose';
import { container } from '@/infrastructure/container';
import type { ILogger } from '@/application/shared/ILogger';
import { LogMessage } from '@/application/shared/LogMessage';
import { LogLevel } from '@/domain/shared/value-objects/LogLevel';

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
      const logger = container.resolve<ILogger>('ILogger');
      new LogMessage(logger).execute(LogLevel.INFO, 'Connected to MongoDB');
    } catch (error) {
      const logger = container.resolve<ILogger>('ILogger');
      new LogMessage(logger).execute(
        LogLevel.ERROR,
        'Failed to connect to MongoDB',
        { error }
      );
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    await mongoose.disconnect();

    this.isConnected = false;
    const logger = container.resolve<ILogger>('ILogger');
    new LogMessage(logger).execute(LogLevel.INFO, 'Disconnected from MongoDB');
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
