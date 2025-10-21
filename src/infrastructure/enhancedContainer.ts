import 'reflect-metadata';
import { container } from 'tsyringe';
import { AsyncFileLoggerAdapter } from '@/infrastructure/shared/adapters/AsyncFileLoggerAdapter';
import { EnhancedLogFormatterService } from '@/domain/shared/services/EnhancedLogFormatterService';
import { LogRotationService } from '@/infrastructure/shared/services/LogRotationService';
import type { ILogger } from '@/application/shared/ILogger';
import { UnifiedLogger } from '@/application/shared/UnifiedLogger';

// Enhanced logger configuration
const logConfig = {
  bufferSize: parseInt(process.env.LOG_BUFFER_SIZE || '100', 10),
  flushInterval: parseInt(process.env.LOG_FLUSH_INTERVAL || '5000', 10),
  maxFileSize: parseInt(process.env.LOG_MAX_FILE_SIZE || '10485760', 10), // 10MB
  maxFiles: parseInt(process.env.LOG_MAX_FILES || '30', 10),
  compressOldFiles: process.env.LOG_COMPRESS !== 'false',
  includeStackTrace: process.env.LOG_STACK_TRACE === 'true',
  compressionLevel: parseInt(process.env.LOG_COMPRESSION_LEVEL || '6', 10), // 1-9
  deleteCompressedOlderThan: parseInt(
    process.env.LOG_DELETE_COMPRESSED_OLDER_THAN || '90',
    10
  ), // days
};

// Register enhanced logger
container.register<ILogger>('ILogger', {
  useFactory: () => {
    const formatter = new EnhancedLogFormatterService({
      includeStackTrace: logConfig.includeStackTrace,
    });

    const logger = new AsyncFileLoggerAdapter(formatter, {
      bufferSize: logConfig.bufferSize,
      flushInterval: logConfig.flushInterval,
    });

    // Start log rotation service
    const logFolder = process.env.LOG_FOLDER || './logs';
    const rotationService = new LogRotationService(logFolder, {
      maxFileSize: logConfig.maxFileSize,
      maxFiles: logConfig.maxFiles,
      compressOldFiles: logConfig.compressOldFiles,
      checkInterval: 60000, // Check every minute
      compressionLevel: logConfig.compressionLevel,
      deleteCompressedOlderThan: logConfig.deleteCompressedOlderThan,
    });

    rotationService.start();

    // Cleanup on process exit
    process.on('SIGINT', async () => {
      rotationService.stop();
      await (logger as AsyncFileLoggerAdapter).destroy();
    });

    process.on('SIGTERM', async () => {
      rotationService.stop();
      await (logger as AsyncFileLoggerAdapter).destroy();
    });

    return logger;
  },
});

// Register unified logger
container.register<UnifiedLogger>('UnifiedLogger', {
  useFactory: () => {
    const baseLogger = container.resolve<ILogger>('ILogger');
    return new UnifiedLogger(baseLogger);
  },
});

// Export enhanced service locators
export class EnhancedLoggerServiceLocator {
  static getLogger(): ILogger {
    return container.resolve<ILogger>('ILogger');
  }

  static getUnifiedLogger(): UnifiedLogger {
    return container.resolve<UnifiedLogger>('UnifiedLogger');
  }
}

export { container };
