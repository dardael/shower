import { AsyncFileLoggerAdapter } from '@/infrastructure/shared/adapters/AsyncFileLoggerAdapter';
import { EnhancedLogFormatterService } from '@/domain/shared/services/EnhancedLogFormatterService';
import { LogLevel } from '@/domain/shared/value-objects/LogLevel';

// Mock the container to avoid ES module issues
jest.mock('@/infrastructure/enhancedContainer', () => ({
  EnhancedLoggerServiceLocator: {
    getUnifiedLogger: () => ({
      info: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      logApiRequest: jest.fn(),
      logApiResponse: jest.fn(),
      measure: jest.fn(),
    }),
  },
}));

describe('Logging Performance Tests', () => {
  let logger: AsyncFileLoggerAdapter;
  let formatter: EnhancedLogFormatterService;

  beforeAll(() => {
    formatter = new EnhancedLogFormatterService({
      includeStackTrace: false,
    });

    logger = new AsyncFileLoggerAdapter(formatter, {
      bufferSize: 50,
      flushInterval: 1000,
    });
  });

  afterAll(async () => {
    // Clean up any pending operations
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  describe('High-volume logging performance', () => {
    it('should handle 1000 log entries efficiently', async () => {
      const startTime = Date.now();
      const logCount = 1000;

      // Generate high-volume logs
      for (let i = 0; i < logCount; i++) {
        await logger.logInfo(`Performance test log entry ${i}`, {
          iteration: i,
          userId: `user-${i % 100}`,
          action: 'test-action',
          timestamp: new Date().toISOString(),
        });
      }

      const endTime = Date.now();
      const duration = endTime - startTime;
      const logsPerSecond = Math.round((logCount / duration) * 1000);

      // Performance assertion: should handle at least 100 logs per second
      expect(logsPerSecond).toBeGreaterThan(100);
      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
    }, 15000);

    it('should handle concurrent logging operations', async () => {
      const startTime = Date.now();
      const concurrentOperations = 10;
      const logsPerOperation = 100;

      // Create concurrent logging operations
      const promises = Array.from(
        { length: concurrentOperations },
        (_, operationIndex) =>
          Promise.all(
            Array.from({ length: logsPerOperation }, (_, logIndex) =>
              logger.logInfo(`Concurrent log ${operationIndex}-${logIndex}`, {
                operationIndex,
                logIndex,
                thread: 'concurrent-test',
              })
            )
          )
      );

      await Promise.all(promises);

      const endTime = Date.now();
      const duration = endTime - startTime;
      const totalLogs = concurrentOperations * logsPerOperation;
      const logsPerSecond = Math.round((totalLogs / duration) * 1000);

      expect(logsPerSecond).toBeGreaterThan(200);
      expect(duration).toBeLessThan(8000);
    }, 12000);

    it('should handle different log levels efficiently', async () => {
      const startTime = Date.now();
      const logCount = 200;

      // Test different log levels
      for (let i = 0; i < logCount; i++) {
        switch (i % 4) {
          case 0:
            await logger.logDebug(`Debug message ${i}`, {
              level: 'debug',
              iteration: i,
            });
            break;
          case 1:
            await logger.logInfo(`Info message ${i}`, {
              level: 'info',
              iteration: i,
            });
            break;
          case 2:
            await logger.logWarning(`Warning message ${i}`, {
              level: 'warn',
              iteration: i,
            });
            break;
          case 3:
            await logger.logError(`Error message ${i}`, {
              level: 'error',
              iteration: i,
            });
            break;
        }
      }

      const endTime = Date.now();
      const duration = endTime - startTime;
      const logsPerSecond = Math.round((logCount / duration) * 1000);

      expect(logsPerSecond).toBeGreaterThan(150);
      expect(duration).toBeLessThan(5000);
    }, 10000);

    it('should handle large metadata objects efficiently', async () => {
      const startTime = Date.now();
      const logCount = 100;

      // Create large metadata objects
      for (let i = 0; i < logCount; i++) {
        const largeMetadata = {
          iteration: i,
          user: {
            id: `user-${i}`,
            name: `Test User ${i}`,
            email: `user${i}@example.com`,
            profile: {
              avatar: `avatar-${i}.jpg`,
              bio: `This is a long biography for user ${i} with lots of details about their background, interests, and activities that would normally be stored in a user profile.`,
              settings: {
                theme: 'dark',
                notifications: true,
                privacy: 'public',
                language: 'en',
                timezone: 'UTC',
                preferences: {
                  marketing: false,
                  analytics: true,
                  personalization: true,
                },
              },
            },
          },
          request: {
            id: `req-${i}`,
            method: 'GET',
            url: `/api/test/${i}`,
            headers: {
              'user-agent': 'Mozilla/5.0 (Test Browser)',
              accept: 'application/json',
              authorization: `Bearer token-${i}`,
            },
            query: {
              page: i,
              limit: 50,
              sort: 'created_at',
              order: 'desc',
            },
          },
          response: {
            status: 200,
            data: Array.from({ length: 10 }, (_, index) => ({
              id: `item-${i}-${index}`,
              name: `Item ${index}`,
              value: Math.random() * 100,
            })),
          },
        };

        await logger.logInfo(`Large metadata test ${i}`, largeMetadata);
      }

      const endTime = Date.now();
      const duration = endTime - startTime;
      const logsPerSecond = Math.round((logCount / duration) * 1000);

      expect(logsPerSecond).toBeGreaterThan(50); // Lower threshold for large metadata
      expect(duration).toBeLessThan(8000);
    }, 12000);
  });

  describe('Memory and resource management', () => {
    it('should not cause memory leaks during extended logging', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      const iterations = 5;
      const logsPerIteration = 200;

      // Perform multiple rounds of intensive logging
      for (let iteration = 0; iteration < iterations; iteration++) {
        for (let i = 0; i < logsPerIteration; i++) {
          await logger.logInfo(`Memory test ${iteration}-${i}`, {
            iteration,
            logIndex: i,
            data: new Array(100)
              .fill(0)
              .map((_, index) => ({ index, value: Math.random() })),
          });
        }

        // Allow some time for async operations to complete
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      const memoryIncreaseMB = memoryIncrease / (1024 * 1024);

      // Memory increase should be reasonable (less than 50MB for this test)
      expect(memoryIncreaseMB).toBeLessThan(50);
    }, 15000);
  });
});
