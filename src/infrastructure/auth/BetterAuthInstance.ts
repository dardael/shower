import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient, Db } from 'mongodb';

// Initialize database connection for Better Auth
let mongoClient: MongoClient | null = null;
let database: Db | null = null;

// Initialize MongoDB connection only if MONGODB_URI is provided
if (process.env.MONGODB_URI) {
  try {
    mongoClient = new MongoClient(process.env.MONGODB_URI);
    database = mongoClient.db();

    // Handle connection errors gracefully
    mongoClient.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    // Connect asynchronously (non-blocking)
    mongoClient.connect().catch((error) => {
      console.error('Failed to connect to MongoDB:', error);
    });
  } catch (error) {
    console.error('Error initializing MongoDB connection:', error);
  }
}

// Build auth configuration dynamically
const authConfig: Record<string, unknown> = {
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
  trustedOrigins:
    process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [],
};

// Add database configuration only if available
if (database && mongoClient) {
  authConfig.database = mongodbAdapter(database, {
    client: mongoClient,
  });
}

export const auth = betterAuth(authConfig);
