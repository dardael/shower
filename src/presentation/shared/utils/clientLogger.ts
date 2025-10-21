import { LogLevel } from '@/domain/shared/value-objects/LogLevel';

export class ClientLogger {
  execute(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>
  ): void {
    const logMessage = `[${level.toString().toUpperCase()}] ${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, metadata);
        break;
      case LogLevel.INFO:
        console.info(logMessage, metadata);
        break;
      case LogLevel.WARNING:
        console.warn(logMessage, metadata);
        break;
      case LogLevel.ERROR:
        console.error(logMessage, metadata);
        break;
      default:
        console.log(logMessage, metadata);
    }
  }
}
