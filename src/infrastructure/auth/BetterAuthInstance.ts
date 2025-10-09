import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { DatabaseConnection } from '../shared/databaseConnection';

// Initialize database connection for Better Auth
const dbConnection = DatabaseConnection.getInstance();

// Create a function to get the database adapter
const getDatabaseAdapter = () => {
  try {
    const client = dbConnection.getMongoClient();
    console.log('Better Auth - Using MongoDB adapter');
    return mongodbAdapter(client.db());
  } catch {
    // If database is not connected, fallback to memory adapter
    console.warn('MongoDB not connected, using memory adapter for Better Auth');
    return undefined;
  }
};

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      enabled: true,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
    cookiePrefix: 'better-auth',
  },
  database: getDatabaseAdapter(),
});
