/**
 * Timeout constants for e2e tests
 */

export const TIMEOUTS = {
  // Short timeouts for quick operations
  QUICK: 100,
  SHORT: 1000,

  // Medium timeouts for standard operations
  MEDIUM: 5000,

  // Long timeouts for complex operations
  LONG: 10000,

  // Extended timeouts for very slow operations
  EXTENDED: 30000,
} as const;

export const RETRY_CONFIG = {
  MAX_RETRIES: 2,
  RETRY_DELAY: TIMEOUTS.SHORT,
} as const;
