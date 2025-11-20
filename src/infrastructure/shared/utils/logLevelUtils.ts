export type LogLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';

export const LOG_LEVELS: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
};

export function shouldLog(level: LogLevel, currentLogLevel: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel];
}

export function getLogLevel(): LogLevel {
  if (typeof window !== 'undefined') {
    // Client-side - use NEXT_PUBLIC_ prefixed variable
    return (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 'INFO';
  } else {
    // Server-side - use regular environment variable
    return (process.env.LOG_LEVEL as LogLevel) || 'INFO';
  }
}
