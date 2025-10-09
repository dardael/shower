import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected: boolean = false;
  private mongoClient: MongoClient | null = null;

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

      // Also create native MongoDB client for Better Auth
      this.mongoClient = new MongoClient(uri);
      await this.mongoClient.connect();

      this.isConnected = true;
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    await mongoose.disconnect();

    if (this.mongoClient) {
      await this.mongoClient.close();
      this.mongoClient = null;
    }

    this.isConnected = false;
    console.log('Disconnected from MongoDB');
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public getMongoClient(): MongoClient {
    if (!this.mongoClient) {
      throw new Error('MongoDB client not initialized. Call connect() first.');
    }
    return this.mongoClient;
  }
}
