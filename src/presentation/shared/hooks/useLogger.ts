'use client';

import { Logger } from '@/application/shared/Logger';

export function useLogger(): Logger {
  return new Logger();
}

// Re-export Logger type for backward compatibility
export type { Logger };
