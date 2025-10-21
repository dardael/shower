import { defineConfig, devices } from '@playwright/test';
import { config as dotenvConfig } from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load test environment variables before configuration
const envTestPath = path.join(process.cwd(), '.env.test');
const envTestLocalPath = path.join(process.cwd(), '.env.test.local');

if (fs.existsSync(envTestPath)) {
  dotenvConfig({ path: envTestPath });
}
if (fs.existsSync(envTestLocalPath)) {
  dotenvConfig({ path: envTestLocalPath, override: true });
}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './test/e2e',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: false,
  /* Retry on CI only */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: 8,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'line',
  /* Global setup and teardown for the tests */
  globalSetup: './test/e2e/global-setup.ts',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Capture screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    env: {
      NODE_ENV: 'development',
      SHOWER_ENV: 'test',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || '',
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || '',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
      MONGODB_URI:
        process.env.MONGODB_URI_TEST || process.env.MONGODB_URI || '',
      LOG_FOLDER: process.env.LOG_FOLDER || './logs',
      LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    },
  },
});
