declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Admin Configuration
      ADMIN_EMAIL: string;

      // Google OAuth Configuration
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;

      // Better Auth Configuration
      BETTER_AUTH_SECRET: string;
      BETTERAUTH_URL?: string;

      // Environment
      NODE_ENV: 'development' | 'production' | 'test';

      //NEXT
      NEXT_PUBLIC_APP_URL: string;

      // Logging Configuration
      LOG_FOLDER: string;
      LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
      LOG_BUFFER_SIZE: string;
      LOG_FLUSH_INTERVAL: string;

      // Log rotation configuration
      LOG_MAX_FILE_SIZE: string;
      LOG_MAX_FILES: string;
      LOG_COMPRESS: string;
      LOG_COMPRESSION_LEVEL: string;
      LOG_DELETE_COMPRESSED_OLDER_THAN: string;

      // Development settings
      LOG_STACK_TRACE: string;

      // Database
      MONGO_URI: string;

      // NPM Configuration
      NPM_CONFIG_UPDATE_NOTIFIER: string;
      NPM_CONFIG_FUND: string;
      NPM_CONFIG_AUDIT: string;
    }
  }
}

export {};
