import { LogLevel } from '@/domain/shared/value-objects/LogLevel';
import { ILogger } from '@/application/shared/ILogger';

export class LogMessage {
  constructor(private readonly logger: ILogger) {}

  execute(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>
  ): void {
    if (level.equals(LogLevel.DEBUG)) {
      this.logger.logDebug(message, metadata);
    } else if (level.equals(LogLevel.INFO)) {
      this.logger.logInfo(message, metadata);
    } else if (level.equals(LogLevel.WARNING)) {
      this.logger.logWarning(message, metadata);
    } else if (level.equals(LogLevel.ERROR)) {
      this.logger.logError(message, metadata);
    }
  }
}
