import { Logger } from '@/application/shared/Logger';
import { LogLevel } from '@/domain/shared/value-objects/LogLevel';
import type { ILogger } from '@/application/shared/ILogger';

const mockLogger: jest.Mocked<ILogger> = {
  logDebug: jest.fn(),
  logInfo: jest.fn(),
  logWarning: jest.fn(),
  logError: jest.fn(),
};

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    jest.clearAllMocks();
    logger = new Logger(mockLogger);
  });

  it('should call logDebug for DEBUG level', () => {
    logger.execute(LogLevel.DEBUG, 'Debug message');
    expect(mockLogger.logDebug).toHaveBeenCalledWith(
      'Debug message',
      undefined
    );
  });

  it('should call logInfo for INFO level', () => {
    logger.execute(LogLevel.INFO, 'Info message', { key: 'value' });
    expect(mockLogger.logInfo).toHaveBeenCalledWith('Info message', {
      key: 'value',
    });
  });

  it('should call logWarning for WARNING level', () => {
    logger.execute(LogLevel.WARNING, 'Warning message');
    expect(mockLogger.logWarning).toHaveBeenCalledWith(
      'Warning message',
      undefined
    );
  });

  it('should call logError for ERROR level', () => {
    logger.execute(LogLevel.ERROR, 'Error message');
    expect(mockLogger.logError).toHaveBeenCalledWith(
      'Error message',
      undefined
    );
  });

  it('should call debug method directly', () => {
    logger.debug('Debug message', { key: 'value' });
    expect(mockLogger.logDebug).toHaveBeenCalledWith('Debug message', {
      key: 'value',
    });
  });

  it('should call info method directly', () => {
    logger.info('Info message', { key: 'value' });
    expect(mockLogger.logInfo).toHaveBeenCalledWith('Info message', {
      key: 'value',
    });
  });

  it('should call warn method directly', () => {
    logger.warn('Warning message', { key: 'value' });
    expect(mockLogger.logWarning).toHaveBeenCalledWith('Warning message', {
      key: 'value',
    });
  });

  it('should call error method directly', () => {
    logger.error('Error message', { key: 'value' });
    expect(mockLogger.logError).toHaveBeenCalledWith('Error message', {
      key: 'value',
    });
  });

  describe('logError', () => {
    it('should handle Error instances correctly', () => {
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

    it('should handle string errors correctly', () => {
      logger.logError('String error', 'Custom message');

      expect(mockLogger.logError).toHaveBeenCalledWith('Custom message', {
        error: {
          name: 'Error',
          message: 'String error',
          stack: expect.any(String),
        },
        type: 'error',
      });
    });

    it('should handle number errors correctly', () => {
      logger.logError(404, 'HTTP error');

      expect(mockLogger.logError).toHaveBeenCalledWith('HTTP error', {
        error: {
          name: 'Error',
          message: '404',
          stack: expect.any(String),
        },
        type: 'error',
      });
    });

    it('should handle object errors correctly', () => {
      const objectError = {
        code: 'VALIDATION_ERROR',
        details: 'Invalid input',
      };
      logger.logError(objectError, 'Validation failed');

      expect(mockLogger.logError).toHaveBeenCalledWith('Validation failed', {
        error: {
          name: 'Error',
          message: '[object Object]',
          stack: expect.any(String),
        },
        type: 'error',
      });
    });

    it('should handle null errors correctly', () => {
      logger.logError(null, 'Null error');

      expect(mockLogger.logError).toHaveBeenCalledWith('Null error', {
        error: {
          name: 'Error',
          message: 'null',
          stack: expect.any(String),
        },
        type: 'error',
      });
    });

    it('should handle undefined errors correctly', () => {
      logger.logError(undefined, 'Undefined error');

      expect(mockLogger.logError).toHaveBeenCalledWith('Undefined error', {
        error: {
          name: 'Error',
          message: 'undefined',
          stack: expect.any(String),
        },
        type: 'error',
      });
    });

    it('should use error message as default when no custom message provided', () => {
      const error = new Error('Default error message');
      logger.logError(error);

      expect(mockLogger.logError).toHaveBeenCalledWith(
        'Default error message',
        {
          error: {
            name: 'Error',
            message: 'Default error message',
            stack: expect.any(String),
          },
          type: 'error',
        }
      );
    });

    it('should handle custom error types', () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'CustomError';
        }
      }

      const customError = new CustomError('Custom error message');
      logger.logError(customError, 'Custom error occurred');

      expect(mockLogger.logError).toHaveBeenCalledWith(
        'Custom error occurred',
        {
          error: {
            name: 'CustomError',
            message: 'Custom error message',
            stack: expect.any(String),
          },
          type: 'error',
        }
      );
    });
  });
});
