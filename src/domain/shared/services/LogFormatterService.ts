import { LogLevel } from '../value-objects/LogLevel';

export class LogFormatterService {
  format(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>
  ): string {
    const timestamp = new Date()
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19);
    const metadataStr = metadata ? ` ${JSON.stringify(metadata)}` : '';
    return `[${timestamp}] ${level.toString().toUpperCase()}: ${message}${metadataStr}`;
  }
}
