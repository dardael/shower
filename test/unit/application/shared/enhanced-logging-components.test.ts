import { Logger } from '@/application/shared/Logger';
import { LogLevel } from '@/domain/shared/value-objects/LogLevel';
import { EnhancedLogFormatterService } from '@/domain/shared/services/EnhancedLogFormatterService';
import { AsyncFileLoggerAdapter } from '@/infrastructure/shared/adapters/AsyncFileLoggerAdapter';
import { promises as fs } from 'fs';
import { join } from 'path';

describe('Enhanced Logging Components', () => {
  const testLogFolder = './test-logs';
  let asyncLogger: AsyncFileLoggerAdapter;
  let unifiedLogger: Logger;

  beforeAll(async () => {
    // Set environment variable for log folder
    process.env.LOG_FOLDER = testLogFolder;

    // Ensure test log folder exists
    await fs.mkdir(testLogFolder, { recursive: true });
  });

  afterAll(async () => {
    // Clean up test log folder
    try {
      if (asyncLogger) {
        await asyncLogger.destroy();
      }

      const files = await fs.readdir(testLogFolder);
      await Promise.all(
        files.map((file) => fs.unlink(join(testLogFolder, file)))
      );
      await fs.rmdir(testLogFolder);
    } catch {
      // Ignore cleanup errors
    }

    // Clean up environment variable
    delete process.env.LOG_FOLDER;
  });

  beforeEach(() => {
    const formatter = new EnhancedLogFormatterService({
      includeStackTrace: false,
    });

    asyncLogger = new AsyncFileLoggerAdapter(formatter, {
      bufferSize: 2,
      flushInterval: 100,
      fallbackToConsole: false,
    });

    unifiedLogger = new Logger(asyncLogger);
  });

  it('should create enhanced logging components', () => {
    expect(asyncLogger).toBeInstanceOf(AsyncFileLoggerAdapter);
    expect(unifiedLogger).toBeInstanceOf(Logger);
  });

  it('should log messages asynchronously and create log files', async () => {
    // Log various messages
    unifiedLogger.info('Test info message', { test: 'component' });
    unifiedLogger.warn('Test warning message', { test: 'component' });
    unifiedLogger.error('Test error message', { test: 'component' });

    // Wait for async write and buffer flush
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Check if log files were created
    const files = await fs.readdir(testLogFolder);
    const logFiles = files.filter((file) => file.endsWith('.log'));

    expect(logFiles.length).toBeGreaterThan(0);

    // Check log file content
    const logFilePath = join(testLogFolder, logFiles[0]);
    const logContent = await fs.readFile(logFilePath, 'utf-8');

    expect(logContent).toContain('Test info message');
    expect(logContent).toContain('Test warning message');
    expect(logContent).toContain('Test error message');
    expect(logContent).toContain('"test":"component"');
  }, 10000);

  it('should measure performance and log results', async () => {
    const result = await unifiedLogger.measure('test-operation', async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return 'operation-result';
    });

    expect(result).toBe('operation-result');

    // Wait for async write
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Check if performance log was written
    const files = await fs.readdir(testLogFolder);
    const logFiles = files.filter((file) => file.endsWith('.log'));

    if (logFiles.length > 0) {
      const logFilePath = join(testLogFolder, logFiles[0]);
      const logContent = await fs.readFile(logFilePath, 'utf-8');

      expect(logContent).toContain('Performance: test-operation took');
      expect(logContent).toContain('success":true');
    }
  }, 10000);

  it('should handle batch logging', async () => {
    const entries = [
      { level: LogLevel.INFO, message: 'Batch message 1' },
      { level: LogLevel.WARNING, message: 'Batch message 2' },
      { level: LogLevel.ERROR, message: 'Batch message 3' },
    ];

    unifiedLogger.batch(entries);

    // Wait for async write
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Check if batch messages were written
    const files = await fs.readdir(testLogFolder);
    const logFiles = files.filter((file) => file.endsWith('.log'));

    if (logFiles.length > 0) {
      const logFilePath = join(testLogFolder, logFiles[0]);
      const logContent = await fs.readFile(logFilePath, 'utf-8');

      expect(logContent).toContain('Batch message 1');
      expect(logContent).toContain('Batch message 2');
      expect(logContent).toContain('Batch message 3');
    }
  }, 10000);

  it('should handle error logging with proper formatting', async () => {
    const error = new Error('Test component error');
    unifiedLogger.logErrorWithObject(error, 'Custom error message', {
      context: 'component-test',
    });

    // Wait for async write
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Check if error was logged properly
    const files = await fs.readdir(testLogFolder);
    const logFiles = files.filter((file) => file.endsWith('.log'));

    if (logFiles.length > 0) {
      const logFilePath = join(testLogFolder, logFiles[0]);
      const logContent = await fs.readFile(logFilePath, 'utf-8');

      expect(logContent).toContain('Custom error message');
      expect(logContent).toContain('"type":"error"');
      expect(logContent).toContain('"context":"component-test"');
    }
  }, 10000);

  it('should handle API request/response logging', () => {
    // These should not throw any errors
    expect(() => {
      unifiedLogger.logApiRequest('POST', '/api/users', 'user123');
      unifiedLogger.logApiResponse('POST', '/api/users', 201, 250);
    }).not.toThrow();
  });

  it('should handle security event logging', () => {
    // These should not throw any errors
    expect(() => {
      unifiedLogger.logSecurity({
        event: 'LOGIN_SUCCESS',
        userId: 'user123',
        ip: '192.168.1.1',
        userAgent: 'Test-Agent/1.0',
      });
    }).not.toThrow();
  });

  it('should handle conditional logging', () => {
    // These should not throw any errors
    expect(() => {
      unifiedLogger.logIf(true, LogLevel.INFO, 'This should be logged');
      unifiedLogger.logIf(false, LogLevel.INFO, 'This should not be logged');
      unifiedLogger.debugIf('Debug message in development', true);
    }).not.toThrow();
  });

  it('should handle performance timers', () => {
    const timer = unifiedLogger.startTimer('test-timer', {
      context: 'timer-test',
    });

    expect(timer.operation).toBe('test-timer');
    expect(timer.metadata).toEqual({ context: 'timer-test' });
    expect(timer.startTime).toBeGreaterThan(0);

    // Should not throw when ending timer
    expect(() => {
      unifiedLogger.endTimer(timer, { result: 'success' });
    }).not.toThrow();
  });

  it('should handle context-aware logging', () => {
    const contextualLogger = unifiedLogger.withContext({
      requestId: 'test-123',
      userId: 'user-456',
    });

    expect(contextualLogger).toBeDefined();

    // Should not throw when using contextual logger
    expect(() => {
      contextualLogger.logInfo('Contextual message');
      contextualLogger.logError('Contextual error');
    }).not.toThrow();
  });
});
