import { appendFileSync, mkdirSync } from 'fs';
import { resolve, join } from 'path';
import { LogLevel } from '@/domain/shared/value-objects/LogLevel';
import { LogFormatterService } from '@/domain/shared/services/LogFormatterService';
import { ILogger } from '@/application/shared/ILogger';

export class FileLoggerAdapter implements ILogger {
  private readonly logFolder: string;
  private readonly currentLogLevel: LogLevel;

  constructor(private readonly formatter: LogFormatterService) {
    const envFolder = process.env.LOG_FOLDER || './logs';
    try {
      this.logFolder = resolve(envFolder);
      mkdirSync(this.logFolder, { recursive: true });
    } catch (err) {
      console.warn(
        `Invalid log folder: ${envFolder}. Using fallback './logs'. Error: ${(err as Error).message}`
      );
      this.logFolder = resolve('./logs');
      mkdirSync(this.logFolder, { recursive: true });
    }

    const envLevel = process.env.LOG_LEVEL || 'info';
    try {
      this.currentLogLevel = LogLevel.fromString(envLevel);
    } catch {
      console.warn(`Invalid log level: ${envLevel}. Using default 'info'.`);
      this.currentLogLevel = LogLevel.INFO;
    }
  }

  private log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>
  ): void {
    if (!level.isHigherOrEqual(this.currentLogLevel)) return;
    const formatted = this.formatter.format(level, message, metadata);
    const date = new Date().toISOString().split('T')[0];
    const filePath = join(this.logFolder, `${date}.log`);
    appendFileSync(filePath, formatted + '\n');
  }

  logDebug(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  logInfo(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  logWarning(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.WARNING, message, metadata);
  }

  logError(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, metadata);
  }
}
