/**
 * @jest-environment node
 */

import { ClientLogProcessor } from '@/infrastructure/shared/services/ClientLogProcessor';
import { Logger } from '@/application/shared/Logger';
import { container } from '@/infrastructure/container';
import { SystemConsoleLogger } from '@/infrastructure/shared/utils/SystemConsoleLogger';

// Mock dependencies
jest.mock('@/infrastructure/container', () => ({
  container: {
    resolve: jest.fn(),
  },
}));
jest.mock('@/infrastructure/shared/utils/SystemConsoleLogger');

// Mock console to suppress output in tests
const mockConsole = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

Object.defineProperty(global, 'console', {
  value: mockConsole,
  writable: true,
});

describe('ClientLogProcessor', () => {
  let processor: ClientLogProcessor;
  let mockLogger: jest.Mocked<Logger>;
  let mockSystemLogger: jest.Mocked<SystemConsoleLogger>;

  // Helper to safely set environment variables
  const setEnvVar = (key: string, value: string | undefined) => {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock logger
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      logApiRequest: jest.fn(),
      logApiResponse: jest.fn(),
      logError: jest.fn(),
      logSecurity: jest.fn(),
      logUserAction: jest.fn(),
      logBusinessEvent: jest.fn(),
      logSystemEvent: jest.fn(),
      logPerformanceMetric: jest.fn(),
      startTimer: jest.fn(),
      endTimer: jest.fn(),
      measure: jest.fn(),
      withContext: jest.fn(),
      child: jest.fn(),
      getPerformanceMonitor: jest.fn(),
      setPerformanceThreshold: jest.fn(),
      logErrorWithObject: jest.fn(),
      execute: jest.fn(),
      batch: jest.fn(),
      logIf: jest.fn(),
      debugIf: jest.fn(),
      getPerformanceStatistics: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    // Mock system logger
    mockSystemLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<SystemConsoleLogger>;

    (SystemConsoleLogger.getInstance as jest.Mock).mockReturnValue(
      mockSystemLogger
    );

    // Mock container
    (container.resolve as jest.Mock).mockReturnValue(mockLogger);

    // Reset singleton instance
    ClientLogProcessor.resetInstance();
    processor = ClientLogProcessor.getInstance();
  });

  afterEach(() => {
    ClientLogProcessor.resetInstance();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ClientLogProcessor.getInstance();
      const instance2 = ClientLogProcessor.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should create new instance after reset', () => {
      const instance1 = ClientLogProcessor.getInstance();
      ClientLogProcessor.resetInstance();
      const instance2 = ClientLogProcessor.getInstance();
      expect(instance1).not.toBe(instance2);
    });
  });

  describe('Logger Initialization', () => {
    it('should initialize logger successfully', async () => {
      expect(processor.isLoggerAvailable()).toBe(false);

      // Trigger initialization by processing logs
      await processor.processLogBatch([], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(processor.isLoggerAvailable()).toBe(true);
      expect(container.resolve).toHaveBeenCalledWith('Logger');
    });

    it('should handle logger initialization failure gracefully', async () => {
      (container.resolve as jest.Mock).mockImplementation(() => {
        throw new Error('Container error');
      });

      const result = await processor.processLogBatch([], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(processor.isLoggerAvailable()).toBe(false);
      expect(result.processed).toBe(0);
      expect(result.errors).toContain(
        'Logger not available - logs not processed'
      );
    });

    it('should log initialization error in development', async () => {
      const originalEnv = process.env.NODE_ENV;

      setEnvVar('NODE_ENV', 'development');

      (container.resolve as jest.Mock).mockImplementation(() => {
        throw new Error('Container error');
      });

      await processor.processLogBatch([], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(mockSystemLogger.warn).toHaveBeenCalledWith(
        'Logger not available',
        expect.objectContaining({
          error: 'Container error',
          component: 'ClientLogProcessor',
        })
      );

      setEnvVar('NODE_ENV', originalEnv);
    });

    it('should not log initialization error in production', async () => {
      const originalEnv = process.env.NODE_ENV;

      setEnvVar('NODE_ENV', 'production');

      (container.resolve as jest.Mock).mockImplementation(() => {
        throw new Error('Container error');
      });

      await processor.processLogBatch([], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(mockSystemLogger.warn).not.toHaveBeenCalled();

      setEnvVar('NODE_ENV', originalEnv);
    });

    it('should handle concurrent initialization requests', async () => {
      let resolveInit: (value: void) => void;
      const initPromise = new Promise<void>((resolve) => {
        resolveInit = resolve;
      });

      (container.resolve as jest.Mock).mockImplementation(() => {
        return initPromise;
      });

      // Start multiple concurrent requests
      const promise1 = processor.processLogBatch([], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      const promise2 = processor.processLogBatch([], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      // Resolve initialization
      resolveInit!();

      const [result1, result2] = await Promise.all([promise1, promise2]);

      expect(container.resolve).toHaveBeenCalledTimes(1);
      expect(result1.processed).toBe(0);
      expect(result2.processed).toBe(0);
    });
  });

  describe('Log Batch Processing', () => {
    beforeEach(async () => {
      // Ensure logger is initialized
      await processor.processLogBatch([], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });
      jest.clearAllMocks(); // Clear initialization calls
    });

    it('should process empty batch successfully', async () => {
      const result = await processor.processLogBatch([], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(result.processed).toBe(0);
      expect(result.errors).toHaveLength(0);
    });

    it('should process single log entry successfully', async () => {
      const logEntry = {
        id: 'test-id',
        level: 'INFO',
        message: 'Test message',
        metadata: { key: 'value' },
        timestamp: new Date().toISOString(),
        clientContext: {
          userAgent: 'test-browser',
          screenResolution: '1920x1080',
          timezone: 'UTC',
          language: 'en',
          sessionId: 'session-123',
        },
      };

      const clientInfo = {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      };

      const result = await processor.processLogBatch([logEntry], clientInfo);

      expect(result.processed).toBe(1);
      expect(result.errors).toHaveLength(0);
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Test message',
        expect.objectContaining({
          key: 'value',
          source: 'client',
          clientContext: logEntry.clientContext,
          batchInfo: {
            clientInfo,
            receivedAt: expect.any(String),
          },
        })
      );
    });

    it('should process multiple log entries successfully', async () => {
      const logEntries = [
        {
          id: 'test-id-1',
          level: 'INFO',
          message: 'Info message',
          metadata: {},
          timestamp: new Date().toISOString(),
        },
        {
          id: 'test-id-2',
          level: 'ERROR',
          message: 'Error message',
          metadata: { error: 'details' },
          timestamp: new Date().toISOString(),
        },
        {
          id: 'test-id-3',
          level: 'DEBUG',
          message: 'Debug message',
          metadata: { debug: true },
          timestamp: new Date().toISOString(),
        },
      ];

      const clientInfo = {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      };

      const result = await processor.processLogBatch(logEntries, clientInfo);

      expect(result.processed).toBe(3);
      expect(result.errors).toHaveLength(0);
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Info message',
        expect.any(Object)
      );
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error message',
        expect.any(Object)
      );
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Debug message',
        expect.any(Object)
      );
    });

    it('should handle processing errors gracefully', async () => {
      const logEntry = {
        id: 'test-id',
        level: 'INFO',
        message: 'Test message',
        metadata: {},
        timestamp: new Date().toISOString(),
      };

      // Mock logger to throw error
      mockLogger.info.mockImplementation(() => {
        throw new Error('Logger error');
      });

      const result = await processor.processLogBatch([logEntry], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(result.processed).toBe(0);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain(
        'Failed to process log entry: Logger error'
      );
    });

    it('should continue processing after individual log errors', async () => {
      const logEntries = [
        {
          id: 'test-id-1',
          level: 'INFO',
          message: 'Good message',
          metadata: {},
          timestamp: new Date().toISOString(),
        },
        {
          id: 'test-id-2',
          level: 'ERROR',
          message: 'Bad message',
          metadata: {},
          timestamp: new Date().toISOString(),
        },
      ];

      // Mock logger to throw error only for error messages
      mockLogger.info.mockImplementation(() => {
        // Success
      });
      mockLogger.error.mockImplementation(() => {
        throw new Error('Logger error');
      });

      const result = await processor.processLogBatch(logEntries, {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(result.processed).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should handle error logging failures gracefully', async () => {
      const logEntry = {
        id: 'test-id',
        level: 'INFO',
        message: 'Test message',
        metadata: {},
        timestamp: new Date().toISOString(),
      };

      // Mock logger to throw error for both main operation and error logging
      mockLogger.info.mockImplementation(() => {
        throw new Error('Main error');
      });
      mockLogger.error.mockImplementation(() => {
        throw new Error('Error logging error');
      });

      const result = await processor.processLogBatch([logEntry], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(result.processed).toBe(0);
      expect(result.errors).toHaveLength(1);
      // Should not throw even when error logging fails
    });
  });

  describe('Log Level Routing', () => {
    beforeEach(async () => {
      await processor.processLogBatch([], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });
      jest.clearAllMocks();
    });

    it('should route DEBUG logs to debug method', async () => {
      const logEntry = {
        id: 'test-id',
        level: 'DEBUG',
        message: 'Debug message',
        metadata: {},
        timestamp: new Date().toISOString(),
      };

      await processor.processLogBatch([logEntry], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Debug message',
        expect.any(Object)
      );
      expect(mockLogger.info).not.toHaveBeenCalled();
      expect(mockLogger.warn).not.toHaveBeenCalled();
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should route INFO logs to info method', async () => {
      const logEntry = {
        id: 'test-id',
        level: 'INFO',
        message: 'Info message',
        metadata: {},
        timestamp: new Date().toISOString(),
      };

      await processor.processLogBatch([logEntry], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Info message',
        expect.any(Object)
      );
      expect(mockLogger.debug).not.toHaveBeenCalled();
      expect(mockLogger.warn).not.toHaveBeenCalled();
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should route WARNING logs to warn method', async () => {
      const logEntry = {
        id: 'test-id',
        level: 'WARNING',
        message: 'Warning message',
        metadata: {},
        timestamp: new Date().toISOString(),
      };

      await processor.processLogBatch([logEntry], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Warning message',
        expect.any(Object)
      );
      expect(mockLogger.info).not.toHaveBeenCalled();
      expect(mockLogger.debug).not.toHaveBeenCalled();
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should route ERROR logs to error method', async () => {
      const logEntry = {
        id: 'test-id',
        level: 'ERROR',
        message: 'Error message',
        metadata: {},
        timestamp: new Date().toISOString(),
      };

      await processor.processLogBatch([logEntry], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error message',
        expect.any(Object)
      );
      expect(mockLogger.info).not.toHaveBeenCalled();
      expect(mockLogger.debug).not.toHaveBeenCalled();
      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('should route unknown log levels to info method', async () => {
      const logEntry = {
        id: 'test-id',
        level: 'UNKNOWN',
        message: 'Unknown level message',
        metadata: {},
        timestamp: new Date().toISOString(),
      };

      await processor.processLogBatch([logEntry], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Unknown level message',
        expect.any(Object)
      );
      expect(mockLogger.debug).not.toHaveBeenCalled();
      expect(mockLogger.warn).not.toHaveBeenCalled();
      expect(mockLogger.error).not.toHaveBeenCalled();
    });
  });

  describe('Metadata Enhancement', () => {
    beforeEach(async () => {
      await processor.processLogBatch([], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });
      jest.clearAllMocks();
    });

    it('should enhance metadata with source information', async () => {
      const logEntry = {
        id: 'test-id',
        level: 'INFO',
        message: 'Test message',
        metadata: { original: 'data' },
        timestamp: new Date().toISOString(),
      };

      const clientInfo = {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: '2023-01-01T00:00:00.000Z',
      };

      await processor.processLogBatch([logEntry], clientInfo);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Test message',
        expect.objectContaining({
          original: 'data',
          source: 'client',
        })
      );
    });

    it('should include client context in enhanced metadata', async () => {
      const clientContext = {
        userAgent: 'test-browser',
        screenResolution: '1920x1080',
        timezone: 'UTC',
        language: 'en',
        sessionId: 'session-123',
      };

      const logEntry = {
        id: 'test-id',
        level: 'INFO',
        message: 'Test message',
        metadata: {},
        timestamp: new Date().toISOString(),
        clientContext,
      };

      await processor.processLogBatch([logEntry], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Test message',
        expect.objectContaining({
          clientContext,
        })
      );
    });

    it('should include batch information in enhanced metadata', async () => {
      const logEntry = {
        id: 'test-id',
        level: 'INFO',
        message: 'Test message',
        metadata: {},
        timestamp: new Date().toISOString(),
      };

      const clientInfo = {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: '2023-01-01T00:00:00.000Z',
      };

      await processor.processLogBatch([logEntry], clientInfo);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Test message',
        expect.objectContaining({
          batchInfo: {
            clientInfo,
            receivedAt: expect.any(String),
          },
        })
      );
    });

    it('should preserve original metadata while adding enhancements', async () => {
      const originalMetadata = {
        userId: 'user-123',
        action: 'login',
        details: { ip: '192.168.1.1', browser: 'chrome' },
      };

      const logEntry = {
        id: 'test-id',
        level: 'INFO',
        message: 'User action',
        metadata: originalMetadata,
        timestamp: new Date().toISOString(),
      };

      await processor.processLogBatch([logEntry], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        'User action',
        expect.objectContaining({
          ...originalMetadata,
          source: 'client',
          batchInfo: expect.any(Object),
        })
      );
    });
  });

  describe('Logger Availability', () => {
    it('should report logger availability correctly', () => {
      expect(processor.isLoggerAvailable()).toBe(false);
    });

    it('should report logger as available after initialization', async () => {
      await processor.processLogBatch([], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(processor.isLoggerAvailable()).toBe(true);
    });

    it('should report logger as unavailable after initialization failure', async () => {
      (container.resolve as jest.Mock).mockImplementation(() => {
        throw new Error('Container error');
      });

      await processor.processLogBatch([], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(processor.isLoggerAvailable()).toBe(false);
    });
  });

  describe('Logger Re-initialization', () => {
    it('should force re-initialization of logger', async () => {
      // Initialize logger first
      await processor.processLogBatch([], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(processor.isLoggerAvailable()).toBe(true);
      expect(container.resolve).toHaveBeenCalledTimes(1);

      // Force re-initialization
      await processor.reinitializeLogger();

      expect(processor.isLoggerAvailable()).toBe(true);
      expect(container.resolve).toHaveBeenCalledTimes(2);
    });

    it('should handle re-initialization failure gracefully', async () => {
      // Initialize successfully first
      await processor.processLogBatch([], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      // Mock container to fail on re-initialization
      (container.resolve as jest.Mock).mockImplementation(() => {
        throw new Error('Re-initialization error');
      });

      await processor.reinitializeLogger();

      expect(processor.isLoggerAvailable()).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null metadata gracefully', async () => {
      const logEntry = {
        id: 'test-id',
        level: 'INFO',
        message: 'Test message',
        metadata: undefined,
        timestamp: new Date().toISOString(),
      };

      await processor.processLogBatch([logEntry], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Test message',
        expect.objectContaining({
          source: 'client',
        })
      );
    });

    it('should handle undefined metadata gracefully', async () => {
      const logEntry = {
        id: 'test-id',
        level: 'INFO',
        message: 'Test message',
        metadata: undefined,
        timestamp: new Date().toISOString(),
      };

      await processor.processLogBatch([logEntry], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Test message',
        expect.objectContaining({
          source: 'client',
        })
      );
    });

    it('should handle complex nested metadata', async () => {
      const complexMetadata = {
        user: {
          id: 'user-123',
          profile: {
            name: 'Test User',
            preferences: {
              theme: 'dark',
              notifications: true,
            },
          },
        },
        session: {
          id: 'session-456',
          startTime: new Date().toISOString(),
          actions: ['login', 'view_page', 'click_button'],
        },
      };

      const logEntry = {
        id: 'test-id',
        level: 'INFO',
        message: 'Complex metadata test',
        metadata: complexMetadata,
        timestamp: new Date().toISOString(),
      };

      await processor.processLogBatch([logEntry], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Complex metadata test',
        expect.objectContaining({
          ...complexMetadata,
          source: 'client',
        })
      );
    });

    it('should handle very long log messages', async () => {
      const longMessage = 'x'.repeat(10000);
      const logEntry = {
        id: 'test-id',
        level: 'INFO',
        message: longMessage,
        metadata: {},
        timestamp: new Date().toISOString(),
      };

      await processor.processLogBatch([logEntry], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        longMessage,
        expect.any(Object)
      );
    });

    it('should handle special characters in log messages', async () => {
      const specialMessage =
        'Test with émojis 🚀 and spëcial chars & symbols < > " \'';
      const logEntry = {
        id: 'test-id',
        level: 'INFO',
        message: specialMessage,
        metadata: {},
        timestamp: new Date().toISOString(),
      };

      await processor.processLogBatch([logEntry], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        specialMessage,
        expect.any(Object)
      );
    });
  });

  describe('Error Scenarios', () => {
    it('should handle processLogEntry errors without logger', async () => {
      // Create a new processor instance without logger
      ClientLogProcessor.resetInstance();
      const processorWithoutLogger = ClientLogProcessor.getInstance();

      // Mock container to throw error (logger not available)
      (container.resolve as jest.Mock).mockImplementation(() => {
        throw new Error('Logger not available');
      });

      const logEntry = {
        id: 'test-id',
        level: 'INFO',
        message: 'Test message',
        metadata: {},
        timestamp: new Date().toISOString(),
      };

      const result = await processorWithoutLogger.processLogBatch([logEntry], {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(result.processed).toBe(0);
      expect(result.errors).toContain(
        'Logger not available - logs not processed'
      );
    });

    it('should handle mixed success and failure in batch', async () => {
      const logEntries = [
        {
          id: 'test-id-1',
          level: 'INFO',
          message: 'Good message',
          metadata: {},
          timestamp: new Date().toISOString(),
        },
        {
          id: 'test-id-2',
          level: 'ERROR',
          message: 'Bad message',
          metadata: {},
          timestamp: new Date().toISOString(),
        },
        {
          id: 'test-id-3',
          level: 'INFO',
          message: 'Another good message',
          metadata: {},
          timestamp: new Date().toISOString(),
        },
      ];

      // Mock logger to fail only for error messages
      mockLogger.info.mockImplementation(() => {
        // Success
      });
      mockLogger.error.mockImplementation(() => {
        throw new Error('Error processing failed');
      });

      const result = await processor.processLogBatch(logEntries, {
        userAgent: 'test-agent',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      });

      expect(result.processed).toBe(2); // Only 2 INFO succeed, ERROR fails
      expect(result.errors).toHaveLength(1);
      expect(mockLogger.info).toHaveBeenCalledTimes(2);
      expect(mockLogger.error).toHaveBeenCalledTimes(2); // 1 for original error + 1 for error logging
    });
  });
});
