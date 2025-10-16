import { config as dotenvConfig } from 'dotenv';
import path from 'path';
import fs from 'fs';

/**
 * Global setup for Playwright tests
 * This runs once before all tests
 */
async function globalSetup() {
  const envTestPath = path.join(process.cwd(), '.env.test');
  const envTestLocalPath = path.join(process.cwd(), '.env.test.local');

  if (fs.existsSync(envTestPath)) {
    dotenvConfig({ path: envTestPath });
    console.log('✅ Loaded .env.test environment variables');
  } else {
    console.warn('⚠️ .env.test file not found, using default values');
  }

  if (fs.existsSync(envTestLocalPath)) {
    dotenvConfig({ path: envTestLocalPath, override: true });
    console.log('✅ Loaded .env.test.local environment variables');
  } else {
    console.warn(
      '⚠️ .env.test.local file not found, sensitive test variables may be missing'
    );
  }

  process.env.MONGODB_URI =
    process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/shower_test';
  if (
    !process.env.MONGODB_URI ||
    !process.env.MONGODB_URI.includes('shower_test')
  ) {
    console.warn('WARNING: MONGODB_URI is not set to a test database');
  }

  // Verify critical environment variables are available
  const requiredEnvVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'BETTERAUTH_SECRET',
    'BETTERAUTH_URL',
    'ADMIN_EMAIL',
    'MONGODB_URI',
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );
  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missingVars.join(', ')}`);
  }

  console.log('✅ Environment setup completed');
}

export default globalSetup;
