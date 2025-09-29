import { LogMessage } from '@/application/shared/LogMessage';
import { LogLevel } from '@/domain/shared/value-objects/LogLevel';
import type { ILogger } from '@/application/shared/ILogger';

const mockLogger: jest.Mocked<ILogger> = {
  logDebug: jest.fn(),
  logInfo: jest.fn(),
  logWarning: jest.fn(),
  logError: jest.fn(),
};

describe('LogMessage', () => {
  let useCase: LogMessage;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new LogMessage(mockLogger);
  });

  it('should call logDebug for DEBUG level', () => {
    useCase.execute(LogLevel.DEBUG, 'Debug message');
    expect(mockLogger.logDebug).toHaveBeenCalledWith(
      'Debug message',
      undefined
    );
  });

  it('should call logInfo for INFO level', () => {
    useCase.execute(LogLevel.INFO, 'Info message', { key: 'value' });
    expect(mockLogger.logInfo).toHaveBeenCalledWith('Info message', {
      key: 'value',
    });
  });

  it('should call logWarning for WARNING level', () => {
    useCase.execute(LogLevel.WARNING, 'Warning message');
    expect(mockLogger.logWarning).toHaveBeenCalledWith(
      'Warning message',
      undefined
    );
  });

  it('should call logError for ERROR level', () => {
    useCase.execute(LogLevel.ERROR, 'Error message');
    expect(mockLogger.logError).toHaveBeenCalledWith(
      'Error message',
      undefined
    );
  });
});
