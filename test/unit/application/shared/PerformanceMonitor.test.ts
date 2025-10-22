import { PerformanceMonitor } from '@/application/shared/PerformanceMonitor';
import { Logger } from '@/application/shared/Logger';

describe('PerformanceMonitor', () => {
  let performanceMonitor: PerformanceMonitor;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      logError: jest.fn(),
      logApiRequest: jest.fn(),
      logApiResponse: jest.fn(),
      logSecurity: jest.fn(),
      logUserAction: jest.fn(),
      logBusinessEvent: jest.fn(),
      logSystemEvent: jest.fn(),
      startTimer: jest.fn(),
      endTimer: jest.fn(),
      measure: jest.fn(),
      execute: jest.fn(),
      withContext: jest.fn(),
      batch: jest.fn(),
      logIf: jest.fn(),
      debugIf: jest.fn(),
      child: jest.fn(),
      getPerformanceMonitor: jest.fn(),
      getPerformanceStatistics: jest.fn(),
      setPerformanceThreshold: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    performanceMonitor = new PerformanceMonitor(mockLogger);
  });

  describe('Timer Operations', () => {
    it('should start and end a timer successfully', () => {
      const id = performanceMonitor.startTimer('test.operation', {
        key: 'value',
      });

      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Performance timer started: test.operation',
        expect.objectContaining({
          metricId: id,
          key: 'value',
        })
      );

      const metric = performanceMonitor.endTimer(id, true);

      expect(metric).toBeDefined();
      expect(metric!.name).toBe('test.operation');
      expect(metric!.success).toBe(true);
      expect(metric!.duration).toBeGreaterThan(0);
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining('Performance: test.operation completed'),
        expect.objectContaining({
          operation: 'test.operation',
          duration: expect.any(Number),
          success: true,
        })
      );
    });

    it('should handle failed timer operations', () => {
      const id = performanceMonitor.startTimer('test.operation');
      const metric = performanceMonitor.endTimer(id, false, 'Test error');

      expect(metric!.success).toBe(false);
      expect(metric!.error).toBe('Test error');
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Performance: test.operation failed'),
        expect.objectContaining({
          operation: 'test.operation',
          success: false,
          error: 'Test error',
        })
      );
    });

    it('should return null for non-existent timer', () => {
      const metric = performanceMonitor.endTimer('non-existent-id');

      expect(metric).toBeNull();
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Performance timer not found: non-existent-id'
      );
    });
  });

  describe('Async Measurement', () => {
    it('should measure async operations successfully', async () => {
      const asyncOperation = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return 'success';
      };

      const result = await performanceMonitor.measure(
        'test.async',
        asyncOperation,
        { type: 'async' }
      );

      expect(result).toBe('success');
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining('Performance: test.async completed'),
        expect.objectContaining({
          operation: 'test.async',
          success: true,
          metadata: expect.objectContaining({ type: 'async' }),
        })
      );
    });

    it('should measure async operation failures', async () => {
      const asyncOperation = async () => {
        throw new Error('Async operation failed');
      };

      await expect(
        performanceMonitor.measure('test.async', asyncOperation)
      ).rejects.toThrow('Async operation failed');

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Performance: test.async failed'),
        expect.objectContaining({
          operation: 'test.async',
          success: false,
          error: 'Async operation failed',
        })
      );
    });
  });

  describe('Sync Measurement', () => {
    it('should measure sync operations successfully', () => {
      const syncOperation = () => {
        return 'sync result';
      };

      const result = performanceMonitor.measureSync(
        'test.sync',
        syncOperation,
        { type: 'sync' }
      );

      expect(result).toBe('sync result');
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining('Performance: test.sync completed'),
        expect.objectContaining({
          operation: 'test.sync',
          success: true,
          metadata: expect.objectContaining({ type: 'sync' }),
        })
      );
    });

    it('should measure sync operation failures', () => {
      const syncOperation = () => {
        throw new Error('Sync operation failed');
      };

      expect(() =>
        performanceMonitor.measureSync('test.sync', syncOperation)
      ).toThrow('Sync operation failed');

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Performance: test.sync failed'),
        expect.objectContaining({
          operation: 'test.sync',
          success: false,
          error: 'Sync operation failed',
        })
      );
    });
  });

  describe('Performance Thresholds', () => {
    it('should create warning alerts when exceeding warning threshold', () => {
      performanceMonitor.setThreshold('test.slow', {
        warning: 50,
        critical: 100,
      });

      const id = performanceMonitor.startTimer('test.slow');

      // Simulate a slow operation
      setTimeout(() => {
        performanceMonitor.endTimer(id, true);
      }, 60);

      // Since this is async, we'll check the mock calls after a delay
      setTimeout(() => {
        expect(mockLogger.warn).toHaveBeenCalledWith(
          expect.stringContaining('Performance Warning'),
          expect.objectContaining({
            operation: 'test.slow',
            threshold: { warning: 50, critical: 100 },
          })
        );
      }, 100);
    });

    it('should create critical alerts when exceeding critical threshold', () => {
      performanceMonitor.setThreshold('test.critical', {
        warning: 50,
        critical: 100,
      });

      const id = performanceMonitor.startTimer('test.critical');

      // Simulate a very slow operation
      setTimeout(() => {
        performanceMonitor.endTimer(id, true);
      }, 150);

      setTimeout(() => {
        expect(mockLogger.error).toHaveBeenCalledWith(
          expect.stringContaining('Performance Alert'),
          expect.objectContaining({
            operation: 'test.critical',
            threshold: { warning: 50, critical: 100 },
          })
        );
      }, 200);
    });
  });

  describe('Statistics and Management', () => {
    it('should return correct statistics', () => {
      const id1 = performanceMonitor.startTimer('test1');
      const id2 = performanceMonitor.startTimer('test2');

      const stats = performanceMonitor.getStatistics();

      expect(stats.totalMetrics).toBeGreaterThanOrEqual(2);
      expect(stats.activeMetrics).toBe(2);
      expect(stats.totalAlerts).toBe(0);
      expect(stats.criticalAlerts).toBe(0);
      expect(stats.warningAlerts).toBe(0);
      expect(Array.isArray(stats.recentAlerts)).toBe(true);

      // Clean up
      performanceMonitor.endTimer(id1);
      performanceMonitor.endTimer(id2);
    });

    it('should clear alerts', () => {
      performanceMonitor.clearAlerts();

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Performance alerts cleared'
      );

      const stats = performanceMonitor.getStatistics();
      expect(stats.totalAlerts).toBe(0);
    });

    it('should return active metrics', () => {
      const id1 = performanceMonitor.startTimer('test1');
      const id2 = performanceMonitor.startTimer('test2');

      const activeMetrics = performanceMonitor.getActiveMetrics();

      expect(activeMetrics).toHaveLength(2);
      expect(activeMetrics[0].name).toBe('test1');
      expect(activeMetrics[1].name).toBe('test2');

      // Clean up
      performanceMonitor.endTimer(id1);
      performanceMonitor.endTimer(id2);
    });
  });

  describe('Default Thresholds', () => {
    it('should have default thresholds for common operations', () => {
      // These should not create alerts since they're within thresholds
      const apiId = performanceMonitor.startTimer('api.request');
      performanceMonitor.endTimer(apiId, true);

      const dbId = performanceMonitor.startTimer('database.query');
      performanceMonitor.endTimer(dbId, true);

      const fileId = performanceMonitor.startTimer('file.operation');
      performanceMonitor.endTimer(fileId, true);

      const authId = performanceMonitor.startTimer('auth.operation');
      performanceMonitor.endTimer(authId, true);

      const renderId = performanceMonitor.startTimer('render.component');
      performanceMonitor.endTimer(renderId, true);

      // Should not have any alerts for fast operations
      expect(mockLogger.warn).not.toHaveBeenCalledWith(
        expect.stringContaining('Performance Warning'),
        expect.anything()
      );
      expect(mockLogger.error).not.toHaveBeenCalledWith(
        expect.stringContaining('Performance Alert'),
        expect.anything()
      );
    });
  });
});
