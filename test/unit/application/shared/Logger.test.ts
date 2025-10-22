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
});
