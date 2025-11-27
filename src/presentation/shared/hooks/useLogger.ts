'use client';

import { Logger } from '@/application/shared/Logger';
import { useMemo } from 'react';

export function useLogger(): Logger {
  return useMemo(() => new Logger(), []);
}

// Re-export Logger type for backward compatibility
export type { Logger };
