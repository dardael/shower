import React from 'react';
import { render, renderHook, act } from '@testing-library/react';
import {
  LoggerProvider,
  useLogger,
} from '@/presentation/shared/contexts/LoggerContext';
import { Logger } from '@/application/shared/Logger';
import type { ILogger } from '@/application/shared/ILogger';

// Mock console methods to prevent test output pollution
const consoleSpies = {
  error: jest.spyOn(console, 'error').mockImplementation(),
  warn: jest.spyOn(console, 'warn').mockImplementation(),
  info: jest.spyOn(console, 'info').mockImplementation(),
  debug: jest.spyOn(console, 'debug').mockImplementation(),
};

describe('LoggerContext', () => {
  let mockLogger: Logger;
  let mockAdapter: ILogger;

  beforeEach(() => {
    mockAdapter = {
      logDebug: jest.fn(),
      logInfo: jest.fn(),
      logWarning: jest.fn(),
      logError: jest.fn(),
    };
    mockLogger = new Logger(mockAdapter);
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore console methods after all tests
    Object.values(consoleSpies).forEach((spy) => spy.mockRestore());
  });

  describe('LoggerProvider', () => {
    it('should provide logger context to children', () => {
      const TestComponent = () => {
        const logger = useLogger();
        // Test that we get the exact same Logger instance
        expect(logger).toBe(mockLogger);
        expect(typeof logger.debug).toBe('function');
        expect(typeof logger.info).toBe('function');
        expect(typeof logger.warn).toBe('function');
        expect(typeof logger.error).toBe('function');
        return <div>Test</div>;
      };

      render(
        <LoggerProvider logger={mockLogger}>
          <TestComponent />
        </LoggerProvider>
      );
    });

    it('should throw error when useLogger is used outside provider', () => {
      const TestComponent = () => {
        const logger = useLogger();
        logger.info('Test message');
        return <div>Test</div>;
      };

      // Should throw error when used outside provider
      expect(() => {
        render(<TestComponent />);
      }).toThrow(
        'useLogger must be used within a LoggerProvider. Ensure your component is wrapped in LoggerProvider.'
      );
    });
  });

  describe('useLogger Hook', () => {
    it('should return logger instance from context', () => {
      const { result } = renderHook(() => useLogger(), {
        wrapper: ({ children }) => (
          <LoggerProvider logger={mockLogger}>{children}</LoggerProvider>
        ),
      });

      expect(result.current).toBe(mockLogger);
    });

    it('should return same logger instance on re-renders', () => {
      const { result, rerender } = renderHook(() => useLogger(), {
        wrapper: ({ children }) => (
          <LoggerProvider logger={mockLogger}>{children}</LoggerProvider>
        ),
      });

      const firstLogger = result.current;

      rerender();

      expect(result.current).toBe(firstLogger);
    });

    it('should work with nested providers', () => {
      const mockAdapter2 = {
        logDebug: jest.fn(),
        logInfo: jest.fn(),
        logWarning: jest.fn(),
        logError: jest.fn(),
      };
      const mockLogger2 = new Logger(mockAdapter2);

      const TestComponent = () => {
        const logger = useLogger();
        return (
          <div data-testid="logger">
            {logger === mockLogger2 ? 'inner' : 'outer'}
          </div>
        );
      };

      const { getByTestId } = render(
        <LoggerProvider logger={mockLogger}>
          <LoggerProvider logger={mockLogger2}>
            <TestComponent />
          </LoggerProvider>
        </LoggerProvider>
      );

      expect(getByTestId('logger').textContent).toBe('inner');
    });
  });

  describe('Integration Tests', () => {
    it('should allow logging through useLogger hook', () => {
      const TestComponent = () => {
        const logger = useLogger();

        React.useEffect(() => {
          logger.info('Test message', { key: 'value' });
        }, [logger]);

        return <div>Test</div>;
      };

      render(
        <LoggerProvider logger={mockLogger}>
          <TestComponent />
        </LoggerProvider>
      );

      expect(mockAdapter.logInfo).toHaveBeenCalledWith('Test message', {
        key: 'value',
      });
    });

    it('should handle different log levels', () => {
      const TestComponent = () => {
        const logger = useLogger();

        React.useEffect(() => {
          logger.debug('Debug message');
          logger.info('Info message');
          logger.warn('Warning message');
          logger.error('Error message');
        }, [logger]);

        return <div>Test</div>;
      };

      render(
        <LoggerProvider logger={mockLogger}>
          <TestComponent />
        </LoggerProvider>
      );

      expect(mockAdapter.logDebug).toHaveBeenCalledWith(
        'Debug message',
        undefined
      );
      expect(mockAdapter.logInfo).toHaveBeenCalledWith(
        'Info message',
        undefined
      );
      expect(mockAdapter.logWarning).toHaveBeenCalledWith(
        'Warning message',
        undefined
      );
      expect(mockAdapter.logError).toHaveBeenCalledWith(
        'Error message',
        undefined
      );
    });

    it('should work with async operations', async () => {
      const TestComponent = () => {
        const logger = useLogger();
        const [data, setData] = React.useState<string>('');

        React.useEffect(() => {
          const fetchData = async () => {
            logger.info('Starting fetch');
            try {
              // Simulate async operation
              await new Promise((resolve) => setTimeout(resolve, 10));
              setData('success');
              logger.info('Fetch completed');
            } catch {
              logger.error('Fetch failed');
            }
          };

          fetchData();
        }, [logger]);

        return <div data-testid="result">{data}</div>;
      };

      render(
        <LoggerProvider logger={mockLogger}>
          <TestComponent />
        </LoggerProvider>
      );

      // Wait for async operations
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(mockAdapter.logInfo).toHaveBeenCalledWith(
        'Starting fetch',
        undefined
      );
      expect(mockAdapter.logInfo).toHaveBeenCalledWith(
        'Fetch completed',
        undefined
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle logger errors gracefully', () => {
      const errorMessage = 'Logger error';
      mockAdapter.logInfo = jest.fn(() => {
        throw new Error(errorMessage);
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const TestComponent = () => {
        const logger = useLogger();

        React.useEffect(() => {
          try {
            logger.info('Test message');
          } catch (error) {
            // Error should be caught by component
            expect(error).toBeInstanceOf(Error);
          }
        }, [logger]);

        return <div>Test</div>;
      };

      render(
        <LoggerProvider logger={mockLogger}>
          <TestComponent />
        </LoggerProvider>
      );

      // Verify that mock was called and threw an error
      expect(mockAdapter.logInfo).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Memory Leak Prevention', () => {
    it('should cleanup RemoteLoggerAdapter on unmount', () => {
      const mockCleanup = jest.fn();
      const mockAdapterWithCleanup = {
        logDebug: jest.fn(),
        logInfo: jest.fn(),
        logWarning: jest.fn(),
        logError: jest.fn(),
        cleanup: mockCleanup,
      };

      // Set constructor name to simulate RemoteLoggerAdapter
      Object.defineProperty(mockAdapterWithCleanup, 'constructor', {
        value: { name: 'RemoteLoggerAdapter' },
        writable: true,
      });

      const testLogger = new Logger(mockAdapterWithCleanup);

      const TestComponent = () => {
        useLogger();
        return <div>Test</div>;
      };

      const { unmount } = render(
        <LoggerProvider logger={testLogger}>
          <TestComponent />
        </LoggerProvider>
      );

      // Unmount component
      unmount();

      // Verify cleanup was called
      expect(mockCleanup).toHaveBeenCalledTimes(1);
    });

    it('should not cleanup non-RemoteLoggerAdapter instances', () => {
      const mockCleanup = jest.fn();
      const mockAdapterWithoutCleanup = {
        logDebug: jest.fn(),
        logInfo: jest.fn(),
        logWarning: jest.fn(),
        logError: jest.fn(),
        cleanup: mockCleanup,
      };

      // Create a logger with a non-RemoteLoggerAdapter
      const testLogger = new Logger(mockAdapterWithoutCleanup);

      const TestComponent = () => {
        useLogger();
        return <div>Test</div>;
      };

      const { unmount } = render(
        <LoggerProvider logger={testLogger}>
          <TestComponent />
        </LoggerProvider>
      );

      // Unmount component
      unmount();

      // Cleanup should not be called for non-RemoteLoggerAdapter
      expect(mockCleanup).not.toHaveBeenCalled();
    });

    it('should handle multiple mount/unmount cycles', () => {
      const mockCleanup = jest.fn();
      const mockAdapterWithCleanup = {
        logDebug: jest.fn(),
        logInfo: jest.fn(),
        logWarning: jest.fn(),
        logError: jest.fn(),
        cleanup: mockCleanup,
      };

      // Set constructor name to simulate RemoteLoggerAdapter
      Object.defineProperty(mockAdapterWithCleanup, 'constructor', {
        value: { name: 'RemoteLoggerAdapter' },
        writable: true,
      });

      const testLogger = new Logger(mockAdapterWithCleanup);

      const TestComponent = () => {
        useLogger();
        return <div>Test</div>;
      };

      const { unmount } = render(
        <LoggerProvider logger={testLogger}>
          <TestComponent />
        </LoggerProvider>
      );

      // First unmount
      unmount();
      expect(mockCleanup).toHaveBeenCalledTimes(1);

      // Remount
      const { unmount: unmount2 } = render(
        <LoggerProvider logger={testLogger}>
          <TestComponent />
        </LoggerProvider>
      );

      // Second unmount
      unmount2();
      expect(mockCleanup).toHaveBeenCalledTimes(2);
    });
  });
});
