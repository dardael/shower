/**
 * Environment variable validation utilities
 */

export type EnvironmentType = 'development' | 'production' | 'test';

/**
 * Validates and returns the current environment type
 * @returns The validated environment type
 * @throws Error if SHOWER_ENV is invalid
 */
export function validateEnvironment(): EnvironmentType {
  const env = process.env.SHOWER_ENV || process.env.NODE_ENV || 'development';

  const validEnvironments: EnvironmentType[] = [
    'development',
    'production',
    'test',
  ];

  if (!validEnvironments.includes(env as EnvironmentType)) {
    throw new Error(
      `Invalid environment: ${env}. Must be one of: ${validEnvironments.join(', ')}`
    );
  }

  return env as EnvironmentType;
}

/**
 * Checks if the current environment is test
 * @returns True if running in test environment
 */
export function isTestEnvironment(): boolean {
  return validateEnvironment() === 'test';
}

/**
 * Checks if the current environment is development
 * @returns True if running in development environment
 */
export function isDevelopmentEnvironment(): boolean {
  return validateEnvironment() === 'development';
}

/**
 * Checks if the current environment is production
 * @returns True if running in production environment
 */
export function isProductionEnvironment(): boolean {
  return validateEnvironment() === 'production';
}
