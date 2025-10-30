import React from 'react';
import { render, renderHook, act } from '@testing-library/react';
import {
  LoggerProvider,
  useLogger,
} from '@/presentation/shared/contexts/LoggerContext';
import { Logger } from '@/application/shared/Logger';
import type { ILogger } from '@/application/shared/ILogger';
import { RemoteLoggerAdapter } from '@/infrastructure/shared/adapters/RemoteLoggerAdapter';

// Mock RemoteLoggerAdapter
jest.mock('@/infrastructure/shared/adapters/RemoteLoggerAdapter', () => ({
  RemoteLoggerAdapter: {
    getInstance: jest.fn(() => ({
      logDebug: jest.fn(),
      logInfo: jest.fn(),
      logWarning: jest.fn(),
      logError: jest.fn(),
    })),
  },
}));

describe('LoggerContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('LoggerProvider', () => {
    it('should provide logger context to children', () => {
      const mockLogger = new Logger(RemoteLoggerAdapter.getInstance());
      const TestComponent = () => {
        const logger = useLogger();
        expect(logger).toBe(mockLogger);
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
      const mockLogger = new Logger(RemoteLoggerAdapter.getInstance());

      const { result } = renderHook(() => useLogger(), {
        wrapper: ({ children }) => (
          <LoggerProvider logger={mockLogger}>{children}</LoggerProvider>
        ),
      });

      expect(result.current).toBe(mockLogger);
    });

    it('should return same logger instance on re-renders', () => {
      const mockLogger = new Logger(RemoteLoggerAdapter.getInstance());

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
      const mockLogger1 = new Logger(RemoteLoggerAdapter.getInstance());
      const mockLogger2 = new Logger(RemoteLoggerAdapter.getInstance());

      const TestComponent = () => {
        const logger = useLogger();
        return (
          <div data-testid="logger">
            {logger === mockLogger2 ? 'inner' : 'outer'}
          </div>
        );
      };

      const { getByTestId } = render(
        <LoggerProvider logger={mockLogger1}>
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
      const mockLogger = new Logger(RemoteLoggerAdapter.getInstance());
      const mockInfo = jest.fn();
      mockLogger.info = mockInfo;

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

      expect(mockInfo).toHaveBeenCalledWith('Test message', { key: 'value' });
    });

    it('should handle different log levels', () => {
      const mockLogger = new Logger(RemoteLoggerAdapter.getInstance());
      const mockDebug = jest.fn();
      const mockInfo = jest.fn();
      const mockWarn = jest.fn();
      const mockError = jest.fn();

      mockLogger.debug = mockDebug;
      mockLogger.info = mockInfo;
      mockLogger.warn = mockWarn;
      mockLogger.error = mockError;

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

      expect(mockDebug).toHaveBeenCalledWith('Debug message');
      expect(mockInfo).toHaveBeenCalledWith('Info message');
      expect(mockWarn).toHaveBeenCalledWith('Warning message');
      expect(mockError).toHaveBeenCalledWith('Error message');
    });

    it('should work with async operations', async () => {
      const mockLogger = new Logger(RemoteLoggerAdapter.getInstance());
      const mockInfo = jest.fn();
      mockLogger.info = mockInfo;

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

      expect(mockInfo).toHaveBeenCalledWith('Starting fetch');
      expect(mockInfo).toHaveBeenCalledWith('Fetch completed');
    });
  });

  describe('Error Handling', () => {
    it('should handle logger errors gracefully', () => {
      const mockLogger = new Logger(RemoteLoggerAdapter.getInstance());
      const errorMessage = 'Logger error';
      mockLogger.info = jest.fn(() => {
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
      expect(mockLogger.info).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Memory Leak Prevention', () => {
    it('should cleanup RemoteLoggerAdapter on unmount', () => {
      const mockCleanup = jest.fn();
      const mockAdapter = {
        logDebug: jest.fn(),
        logInfo: jest.fn(),
        logWarning: jest.fn(),
        logError: jest.fn(),
        cleanup: mockCleanup,
      };

      // Set the constructor name to simulate RemoteLoggerAdapter
      Object.defineProperty(mockAdapter, 'constructor', {
        value: { name: 'RemoteLoggerAdapter' },
        writable: true,
      });

      const testLogger = new Logger(mockAdapter as unknown as ILogger);

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
      const mockAdapter = {
        logDebug: jest.fn(),
        logInfo: jest.fn(),
        logWarning: jest.fn(),
        logError: jest.fn(),
        cleanup: mockCleanup,
      };

      // Create a logger with a non-RemoteLoggerAdapter
      const testLogger = new Logger(mockAdapter as unknown as ILogger);

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
      const mockAdapter = {
        logDebug: jest.fn(),
        logInfo: jest.fn(),
        logWarning: jest.fn(),
        logError: jest.fn(),
        cleanup: mockCleanup,
      };

      // Set the constructor name to simulate RemoteLoggerAdapter
      Object.defineProperty(mockAdapter, 'constructor', {
        value: { name: 'RemoteLoggerAdapter' },
        writable: true,
      });

      const testLogger = new Logger(mockAdapter as unknown as ILogger);

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
