import { UnifiedLogger } from '@/application/shared/UnifiedLogger';
import { LogLevel } from '@/domain/shared/value-objects/LogLevel';
import { EnhancedLogFormatterService } from '@/domain/shared/services/EnhancedLogFormatterService';
import { AsyncFileLoggerAdapter } from '@/infrastructure/shared/adapters/AsyncFileLoggerAdapter';

describe('UnifiedLogger', () => {
  let logger: UnifiedLogger;
  let mockLogger: jest.Mocked<AsyncFileLoggerAdapter>;

  beforeEach(() => {
    const formatter = new EnhancedLogFormatterService({
      includeStackTrace: false,
    });

    mockLogger = new AsyncFileLoggerAdapter(formatter, {
      bufferSize: 1,
      flushInterval: 100,
    }) as jest.Mocked<AsyncFileLoggerAdapter>;

    // Mock the logger methods
    mockLogger.logDebug = jest.fn();
    mockLogger.logInfo = jest.fn();
    mockLogger.logWarning = jest.fn();
    mockLogger.logError = jest.fn();

    logger = new UnifiedLogger(mockLogger);
  });

  describe('Direct logging methods', () => {
    it('should call debug method', () => {
      logger.debug('Debug message', { key: 'value' });
      expect(mockLogger.logDebug).toHaveBeenCalledWith('Debug message', {
        key: 'value',
      });
    });

    it('should call info method', () => {
      logger.info('Info message', { key: 'value' });
      expect(mockLogger.logInfo).toHaveBeenCalledWith('Info message', {
        key: 'value',
      });
    });

    it('should call warning method', () => {
      logger.warn('Warning message', { key: 'value' });
      expect(mockLogger.logWarning).toHaveBeenCalledWith('Warning message', {
        key: 'value',
      });
    });

    it('should call error method', () => {
      logger.error('Error message', { key: 'value' });
      expect(mockLogger.logError).toHaveBeenCalledWith('Error message', {
        key: 'value',
      });
    });
  });

  describe('Level-based logging', () => {
    it('should execute debug level', () => {
      logger.execute(LogLevel.DEBUG, 'Debug message');
      expect(mockLogger.logDebug).toHaveBeenCalledWith(
        'Debug message',
        undefined
      );
    });

    it('should execute info level', () => {
      logger.execute(LogLevel.INFO, 'Info message');
      expect(mockLogger.logInfo).toHaveBeenCalledWith(
        'Info message',
        undefined
      );
    });

    it('should execute warning level', () => {
      logger.execute(LogLevel.WARNING, 'Warning message');
      expect(mockLogger.logWarning).toHaveBeenCalledWith(
        'Warning message',
        undefined
      );
    });

    it('should execute error level', () => {
      logger.execute(LogLevel.ERROR, 'Error message');
      expect(mockLogger.logError).toHaveBeenCalledWith(
        'Error message',
        undefined
      );
    });
  });

  describe('Convenience methods', () => {
    it('should log error with error object', () => {
      const error = new Error('Test error');
      logger.logError(error, 'Custom message', { context: 'test' });

      expect(mockLogger.logError).toHaveBeenCalledWith('Custom message', {
        context: 'test',
        error: {
          name: 'Error',
          message: 'Test error',
          stack: expect.any(String),
        },
        type: 'error',
      });
    });

    it('should log API request', () => {
      logger.logApiRequest('GET', '/api/test', 'user123');

      expect(mockLogger.logInfo).toHaveBeenCalledWith(
        'API Request: GET /api/test',
        {
          method: 'GET',
          url: '/api/test',
          userId: 'user123',
          type: 'api_request',
        }
      );
    });

    it('should log API response with success status', () => {
      logger.logApiResponse('GET', '/api/test', 200, 150);

      expect(mockLogger.logInfo).toHaveBeenCalledWith(
        'API Response: GET /api/test - 200 (150ms)',
        {
          method: 'GET',
          url: '/api/test',
          statusCode: 200,
          duration: 150,
          type: 'api_response',
        }
      );
    });

    it('should log API response with error status', () => {
      logger.logApiResponse('GET', '/api/test', 500, 150);

      expect(mockLogger.logWarning).toHaveBeenCalledWith(
        'API Response: GET /api/test - 500 (150ms)',
        {
          method: 'GET',
          url: '/api/test',
          statusCode: 500,
          duration: 150,
          type: 'api_response',
        }
      );
    });

    it('should log security event', () => {
      logger.logSecurity({
        event: 'LOGIN_FAILED',
        userId: 'user123',
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      });

      expect(mockLogger.logWarning).toHaveBeenCalledWith(
        'Security Event: LOGIN_FAILED',
        {
          event: 'LOGIN_FAILED',
          userId: 'user123',
          ip: '192.168.1.1',
          userAgent: 'Mozilla/5.0',
          type: 'security',
          timestamp: expect.any(String),
        }
      );
    });

    it('should log user action', () => {
      logger.logUserAction('PAGE_VIEW', 'user123', { page: '/dashboard' });

      expect(mockLogger.logInfo).toHaveBeenCalledWith(
        'User Action: PAGE_VIEW',
        {
          action: 'PAGE_VIEW',
          userId: 'user123',
          page: '/dashboard',
          type: 'user_action',
        }
      );
    });
  });

  describe('Performance measurement', () => {
    it('should start timer', () => {
      const timer = logger.startTimer('test-operation', { context: 'test' });

      expect(timer.operation).toBe('test-operation');
      expect(timer.metadata).toEqual({ context: 'test' });
      expect(timer.startTime).toBeGreaterThan(0);
    });

    it('should end timer with short duration', () => {
      const timer = logger.startTimer('test-operation');
      timer.startTime = Date.now() - 100; // 100ms ago

      logger.endTimer(timer, { result: 'success' });

      expect(mockLogger.logInfo).toHaveBeenCalledWith(
        'Performance: test-operation took 100ms',
        {
          result: 'success',
          operation: 'test-operation',
          duration: expect.any(Number),
          type: 'performance',
        }
      );
    });

    it('should end timer with long duration as warning', () => {
      const timer = logger.startTimer('test-operation');
      timer.startTime = Date.now() - 2000; // 2 seconds ago

      logger.endTimer(timer);

      expect(mockLogger.logWarning).toHaveBeenCalledWith(
        'Performance: test-operation took 2000ms',
        {
          operation: 'test-operation',
          duration: expect.any(Number),
          type: 'performance',
        }
      );
    });

    it('should measure async operation', async () => {
      const mockFn = jest.fn().mockResolvedValue('result');
      const result = await logger.measure('test-operation', mockFn, {
        context: 'test',
      });

      expect(result).toBe('result');
      expect(mockFn).toHaveBeenCalled();
      expect(mockLogger.logInfo).toHaveBeenCalledWith(
        expect.stringMatching(/Performance: test-operation took \d+ms/),
        expect.objectContaining({
          context: 'test',
          operation: 'test-operation',
          duration: expect.any(Number),
          success: true,
          type: 'performance',
        })
      );
    });

    it('should measure async operation that fails', async () => {
      const error = new Error('Test error');
      const mockFn = jest.fn().mockRejectedValue(error);

      await expect(logger.measure('test-operation', mockFn)).rejects.toThrow(
        'Test error'
      );
      expect(mockLogger.logInfo).toHaveBeenCalledWith(
        expect.stringMatching(/Performance: test-operation took \d+ms/),
        expect.objectContaining({
          operation: 'test-operation',
          duration: expect.any(Number),
          success: false,
          error: 'Test error',
          type: 'performance',
        })
      );
    });
  });

  describe('Batch and conditional logging', () => {
    it('should batch log entries', () => {
      const entries = [
        { level: LogLevel.INFO, message: 'Info message' },
        { level: LogLevel.ERROR, message: 'Error message' },
      ];

      logger.batch(entries);

      expect(mockLogger.logInfo).toHaveBeenCalledWith(
        'Info message',
        undefined
      );
      expect(mockLogger.logError).toHaveBeenCalledWith(
        'Error message',
        undefined
      );
    });

    it('should log if condition is true', () => {
      logger.logIf(true, LogLevel.INFO, 'Conditional message');

      expect(mockLogger.logInfo).toHaveBeenCalledWith(
        'Conditional message',
        undefined
      );
    });

    it('should not log if condition is false', () => {
      logger.logIf(false, LogLevel.INFO, 'Conditional message');

      expect(mockLogger.logInfo).not.toHaveBeenCalled();
    });

    it('should debug when condition is true', () => {
      logger.debugIf('Debug message', true);

      expect(mockLogger.logDebug).toHaveBeenCalledWith(
        'Debug message',
        undefined
      );
    });

    it('should not debug when condition is false', () => {
      logger.debugIf('Debug message', false);

      expect(mockLogger.logDebug).not.toHaveBeenCalled();
    });
  });
});
