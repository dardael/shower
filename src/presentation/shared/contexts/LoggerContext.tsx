'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { Logger } from '@/application/shared/Logger';

export interface LoggerContextValue {
  logger: Logger;
  isOnline: boolean;
}

export const LoggerContext = createContext<LoggerContextValue | null>(null);

interface LoggerProviderProps {
  children: ReactNode;
  logger: Logger;
  isOnline?: boolean;
}

export function LoggerProvider({
  children,
  logger,
  isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true,
}: LoggerProviderProps) {
  const value: LoggerContextValue = {
    logger,
    isOnline,
  };

  useEffect(() => {
    // Cleanup function for component unmount
    return () => {
      // Check if logger is using RemoteLoggerAdapter and cleanup if needed
      const loggerInstance = logger as unknown as {
        logger?: { cleanup?: () => void; constructor?: { name?: string } };
      };
      const adapter = loggerInstance.logger;
      if (
        adapter &&
        typeof adapter === 'object' &&
        'cleanup' in adapter &&
        typeof adapter.cleanup === 'function' &&
        adapter.constructor?.name === 'RemoteLoggerAdapter'
      ) {
        adapter.cleanup();
      }
    };
  }, [logger]);

  return (
    <LoggerContext.Provider value={value}>{children}</LoggerContext.Provider>
  );
}

export function useLogger(): Logger {
  const context = useContext(LoggerContext);

  if (!context) {
    throw new Error(
      'useLogger must be used within a LoggerProvider. Ensure your component is wrapped in LoggerProvider.'
    );
  }

  return context.logger;
}

export function useLoggerContext(): LoggerContextValue {
  const context = useContext(LoggerContext);

  if (!context) {
    throw new Error('useLoggerContext must be used within a LoggerProvider');
  }

  return context;
}
