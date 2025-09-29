import { FileLoggerAdapter } from '@/infrastructure/shared/adapters/FileLoggerAdapter';
import { LogFormatterService } from '@/domain/shared/services/LogFormatterService';

jest.mock('fs', () => ({
  appendFileSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

jest.mock('path', () => ({
  resolve: jest.fn((path) => path),
  join: jest.fn((...args) => args.join('/')),
}));

import { appendFileSync, mkdirSync } from 'fs';
import { resolve, join } from 'path';

describe('FileLoggerAdapter', () => {
  let adapter: FileLoggerAdapter;
  let formatter: LogFormatterService;

  beforeEach(() => {
    jest.clearAllMocks();
    (resolve as jest.Mock).mockImplementation((path) => path);
    (join as jest.Mock).mockImplementation((...args) => args.join('/'));
    formatter = new LogFormatterService();
  });

  it('should log info message when level is allowed', () => {
    process.env.LOG_LEVEL = 'info';
    process.env.LOG_FOLDER = './logs';
    adapter = new FileLoggerAdapter(formatter);
    adapter.logInfo('Test message');
    expect(appendFileSync).toHaveBeenCalled();
  });

  it('should not log debug message when level is info', () => {
    process.env.LOG_LEVEL = 'info';
    process.env.LOG_FOLDER = './logs';
    adapter = new FileLoggerAdapter(formatter);
    adapter.logDebug('Test message');
    expect(appendFileSync).not.toHaveBeenCalled();
  });

  it('should use fallback folder on invalid path', () => {
    process.env.LOG_LEVEL = 'info';
    process.env.LOG_FOLDER = '/invalid/path';
    (mkdirSync as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid path');
    });
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    adapter = new FileLoggerAdapter(formatter);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid log folder')
    );
    consoleWarnSpy.mockRestore();
  });
});
