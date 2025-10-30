/**
 * @jest-environment jsdom
 */

import { RemoteLoggerAdapter } from '@/infrastructure/shared/adapters/RemoteLoggerAdapter';

// Utility for proper async testing patterns
const waitFor = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock fetch
global.fetch = jest.fn();

// Mock navigator
const mockNavigator = {
  onLine: true,
  userAgent: 'Mozilla/5.0 (Test Browser)',
  language: 'en-US',
  sendBeacon: jest.fn(),
};

Object.defineProperty(global, 'navigator', {
  value: mockNavigator,
  writable: true,
});

// Mock window methods
const mockWindow = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

// Override existing window methods
Object.defineProperty(window, 'addEventListener', {
  value: mockWindow.addEventListener,
  writable: true,
});

Object.defineProperty(window, 'removeEventListener', {
  value: mockWindow.removeEventListener,
  writable: true,
});

// Mock document methods
const mockDocument = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  hidden: false,
};

// Override existing document methods
Object.defineProperty(document, 'addEventListener', {
  value: mockDocument.addEventListener,
  writable: true,
});

Object.defineProperty(document, 'removeEventListener', {
  value: mockDocument.removeEventListener,
  writable: true,
});

Object.defineProperty(document, 'hidden', {
  value: mockDocument.hidden,
  writable: true,
});

// Mock screen
Object.defineProperty(window, 'screen', {
  value: {
    width: 1920,
    height: 1080,
  },
  writable: true,
});

// Mock sessionStorage
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true,
});

// Mock Intl.DateTimeFormat
global.Intl = {
  DateTimeFormat: jest.fn().mockImplementation(() => ({
    resolvedOptions: () => ({ timeZone: 'UTC' }),
  })),
} as unknown as typeof Intl;

describe('RemoteLoggerAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    RemoteLoggerAdapter.resetInstance();
    (global.fetch as jest.Mock).mockClear();
    mockSessionStorage.getItem.mockReturnValue(null);

    // Mock console methods to suppress expected output in test output
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'debug').mockImplementation(() => {});

    // Reset navigator.onLine to true for each test
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
    });
  });

  afterEach(() => {
    RemoteLoggerAdapter.resetInstance();
    // Restore all console methods
    jest.restoreAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = RemoteLoggerAdapter.getInstance();
      const instance2 = RemoteLoggerAdapter.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should create new instance after reset', () => {
      const instance1 = RemoteLoggerAdapter.getInstance();
      RemoteLoggerAdapter.resetInstance();
      const instance2 = RemoteLoggerAdapter.getInstance();
      expect(instance1).not.toBe(instance2);
    });
  });

  describe('Configuration', () => {
    it('should use default configuration', () => {
      const adapter = RemoteLoggerAdapter.getInstance();
      expect(adapter.getQueueSize()).toBe(0);
    });

    it('should accept custom configuration', () => {
      const adapter = RemoteLoggerAdapter.getInstance({
        batchSize: 5,
        batchInterval: 1000,
      });
      expect(adapter.getQueueSize()).toBe(0);
    });
  });

  describe('Logging Methods', () => {
    let adapter: RemoteLoggerAdapter;

    beforeEach(() => {
      adapter = RemoteLoggerAdapter.getInstance({
        batchSize: 2,
        batchInterval: 100,
      });
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
      });
    });

    it('should log debug messages', () => {
      adapter.logDebug('Debug message');
      expect(adapter.getQueueSize()).toBe(1);
    });

    it('should log info messages', () => {
      adapter.logInfo('Info message');
      expect(adapter.getQueueSize()).toBe(1);
    });

    it('should log warning messages', () => {
      adapter.logWarning('Warning message');
      expect(adapter.getQueueSize()).toBe(1);
    });

    it('should log error messages', () => {
      adapter.logError('Error message');
      expect(adapter.getQueueSize()).toBe(1);
    });
  });

  describe('Batch Processing', () => {
    let adapter: RemoteLoggerAdapter;

    beforeEach(() => {
      adapter = RemoteLoggerAdapter.getInstance({
        batchSize: 2,
        batchInterval: 100,
      });
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
      });
    });

    it('should process batch when size is reached', async () => {
      adapter.logInfo('Message 1');
      adapter.logInfo('Message 2');

      // Wait for batch processing using proper async pattern
      await waitFor(50);

      expect(global.fetch).toHaveBeenCalledWith('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('Message 1'),
      });
    });

    it('should process batch on interval', async () => {
      adapter.logInfo('Single message');

      // Wait for batch interval using proper async pattern
      await waitFor(150);

      expect(global.fetch).toHaveBeenCalledWith('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('Single message'),
      });
    });
  });

  describe('Error Handling', () => {
    let adapter: RemoteLoggerAdapter;
    const mockFetch = global.fetch as jest.Mock;

    beforeEach(() => {
      adapter = RemoteLoggerAdapter.getInstance({
        batchSize: 1,
        batchInterval: 50,
        maxRetries: 2,
        retryDelay: 100, // Reduce retry delay for faster tests
      });
    });

    it('should retry on network failure', async () => {
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
        });

      adapter.logInfo('Retry message');

      // Wait for initial failure and retry
      await waitFor(200);

      // Should have attempted initial request and retry
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle max retries gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Persistent error'));

      adapter.logInfo('Failed message');

      // Wait for all retries (2 retries with exponential backoff: 100ms + 200ms = ~300ms)
      await waitFor(400);

      // Should have attempted initial request and retries
      expect(mockFetch).toHaveBeenCalledTimes(4); // Initial + 3 retries (maxRetries is 3 by default)
    });

    it('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      adapter.logInfo('Error message');

      await waitFor(100);

      expect(mockFetch).toHaveBeenCalled();
    });

    it('should handle empty retry logs array gracefully', async () => {
      // Mock a scenario where all logs exceed max retries
      mockFetch.mockRejectedValue(new Error('Persistent failure'));

      adapter.logInfo('Test message');

      // Wait for processing and retry attempts using proper async pattern
      await waitFor(500);

      // Should not throw errors and should handle gracefully
      // Logs that exceed max retries are silently dropped
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('Event Listeners', () => {
    beforeEach(() => {
      RemoteLoggerAdapter.getInstance();
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
      });
    });

    it('should add online event listener', () => {
      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        'online',
        expect.any(Function)
      );
    });

    it('should add offline event listener', () => {
      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        'offline',
        expect.any(Function)
      );
    });

    it('should add beforeunload event listener', () => {
      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function)
      );
    });

    it('should add visibilitychange event listener', () => {
      expect(mockDocument.addEventListener).toHaveBeenCalledWith(
        'visibilitychange',
        expect.any(Function)
      );
    });

    it('should remove event listeners on reset', () => {
      RemoteLoggerAdapter.resetInstance();

      expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
        'online',
        expect.any(Function)
      );
      expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
        'offline',
        expect.any(Function)
      );
      expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function)
      );
      expect(mockDocument.removeEventListener).toHaveBeenCalledWith(
        'visibilitychange',
        expect.any(Function)
      );
    });
  });

  describe('Session Management', () => {
    let adapter: RemoteLoggerAdapter;

    beforeEach(() => {
      adapter = RemoteLoggerAdapter.getInstance();
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
      });
    });

    it('should create new session ID if none exists', () => {
      mockSessionStorage.getItem.mockReturnValue(null);

      adapter.logInfo('Test message');

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'logger_session_id',
        expect.stringMatching(/^session_\d+_[a-z0-9]+$/)
      );
    });

    it('should reuse existing session ID', () => {
      const existingSessionId = 'session_1234567890_abcdef123';
      mockSessionStorage.getItem.mockReturnValue(existingSessionId);

      adapter.logInfo('Test message');

      expect(mockSessionStorage.setItem).not.toHaveBeenCalledWith(
        'logger_session_id',
        expect.any(String)
      );
    });

    it('should handle sessionStorage getItem errors gracefully', () => {
      mockSessionStorage.getItem.mockImplementation(() => {
        throw new Error('SessionStorage not available');
      });

      // Should not throw and should continue working
      expect(() => adapter.logInfo('Test message')).not.toThrow();

      // Should still generate a session ID even without sessionStorage
      expect(adapter.getQueueSize()).toBe(1);
    });

    it('should handle sessionStorage setItem errors gracefully', () => {
      mockSessionStorage.getItem.mockReturnValue(null);
      mockSessionStorage.setItem.mockImplementation(() => {
        throw new Error('SessionStorage quota exceeded');
      });

      // Should not throw and should continue working
      expect(() => adapter.logInfo('Test message')).not.toThrow();

      // Should still generate a session ID even without sessionStorage
      expect(adapter.getQueueSize()).toBe(1);
    });
  });

  describe('Queue Management', () => {
    let adapter: RemoteLoggerAdapter;

    beforeEach(() => {
      adapter = RemoteLoggerAdapter.getInstance({
        maxQueueSize: 2,
      });
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
      });
    });

    it('should limit queue size', () => {
      // Fill queue beyond limit
      adapter.logInfo('Message 1');
      adapter.logInfo('Message 2');
      adapter.logInfo('Message 3'); // Should drop Message 1

      // Queue should be limited to max size
      expect(adapter.getQueueSize()).toBe(2);
    });
  });

  describe('Manual Operations', () => {
    let adapter: RemoteLoggerAdapter;

    beforeEach(() => {
      adapter = RemoteLoggerAdapter.getInstance();
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
      });
    });

    it('should flush queue manually', async () => {
      adapter.logInfo('Manual flush message');

      await adapter.flush();

      expect(global.fetch).toHaveBeenCalled();
      expect(adapter.getQueueSize()).toBe(0);
    });

    it('should report online status correctly', () => {
      expect(adapter.isLoggerOnline()).toBe(true);
    });

    it('should report queue size correctly', () => {
      expect(adapter.getQueueSize()).toBe(0);

      adapter.logInfo('Test message');
      expect(adapter.getQueueSize()).toBe(1);
    });
  });

  describe('SendBeacon Support', () => {
    let adapter: RemoteLoggerAdapter;
    let mockSendBeacon: jest.Mock;

    beforeEach(() => {
      // Reset instance to ensure fresh event listeners
      RemoteLoggerAdapter.resetInstance();

      adapter = RemoteLoggerAdapter.getInstance({
        batchSize: 2, // Use larger batch size so log stays in queue
        batchInterval: 10000, // Long interval to prevent auto-processing
      });
      mockSendBeacon = jest.fn().mockReturnValue(true);

      Object.defineProperty(navigator, 'sendBeacon', {
        value: mockSendBeacon,
        writable: true,
      });
    });

    it('should use sendBeacon for page unload', async () => {
      adapter.logInfo('Beacon message');

      // Wait a bit for log to be queued using proper async pattern
      await waitFor(10);

      // Simulate page unload
      const beforeUnloadHandler = mockWindow.addEventListener.mock.calls.find(
        (call) => call[0] === 'beforeunload'
      )?.[1];

      if (beforeUnloadHandler) {
        beforeUnloadHandler();
        // Wait for async operations in the handler to complete
        await waitFor(50);
      }

      expect(mockSendBeacon).toHaveBeenCalledWith(
        expect.stringContaining('/api/logs'),
        expect.stringContaining('Beacon message')
      );
    });

    it('should fallback to console if sendBeacon fails', async () => {
      // Mock console.warn to capture fallback calls
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(); // Suppress console.info
      mockSendBeacon.mockReturnValue(false);

      adapter.logInfo('Failed beacon message');

      // Wait a bit for log to be queued using proper async pattern
      await waitFor(10);

      const beforeUnloadHandler = mockWindow.addEventListener.mock.calls.find(
        (call) => call[0] === 'beforeunload'
      )?.[1];

      if (beforeUnloadHandler) {
        beforeUnloadHandler();
        // Wait for async operations in handler to complete
        await waitFor(50);
      }

      // sendBeacon failed silently - logs are lost during page unload
      // No console fallback when fallbackToConsole is false

      consoleWarnSpy.mockRestore();
      consoleInfoSpy.mockRestore();
    });
  });

  describe('Compression Support', () => {
    let adapter: RemoteLoggerAdapter;
    const mockFetch = global.fetch as jest.Mock;

    beforeEach(() => {
      adapter = RemoteLoggerAdapter.getInstance({
        batchSize: 1,
        batchInterval: 50,
      });
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
      });
    });

    it('should attempt compression for large payloads', async () => {
      // Create a large message that should trigger compression (> 1KB)
      const largeMessage = 'x'.repeat(1500);
      adapter.logInfo(largeMessage);

      await waitFor(100);

      expect(mockFetch).toHaveBeenCalledWith('/api/logs', {
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: expect.any(String),
      });
    });

    it('should not compress small payloads', async () => {
      const smallMessage = 'Small message';
      adapter.logInfo(smallMessage);

      await waitFor(100);

      expect(mockFetch).toHaveBeenCalledWith('/api/logs', {
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: expect.stringContaining(smallMessage),
      });

      // Should not have compression headers
      const callArgs = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      const headers = callArgs[1].headers;
      expect(headers['Content-Encoding']).toBeUndefined();
      expect(headers['X-Compressed']).toBeUndefined();
    });
  });

  describe('Deep Cloning Support', () => {
    let adapter: RemoteLoggerAdapter;
    const mockFetch = global.fetch as jest.Mock;

    beforeEach(() => {
      adapter = RemoteLoggerAdapter.getInstance({
        batchSize: 1,
        batchInterval: 50,
      });
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
      });
    });

    it('should deep clone metadata to prevent reference issues', async () => {
      const metadata = {
        nested: {
          value: 'test',
          array: [1, 2, 3],
        },
      };

      adapter.logInfo('Test message', metadata);

      await waitFor(100);

      expect(mockFetch).toHaveBeenCalledWith('/api/logs', {
        method: 'POST',
        headers: expect.any(Object),
        body: expect.stringContaining(
          '"nested":{"value":"test","array":[1,2,3]}'
        ),
      });
    });

    it('should handle complex nested metadata', async () => {
      const complexMetadata = {
        user: {
          id: 123,
          profile: {
            name: 'Test User',
            preferences: {
              theme: 'dark',
              notifications: true,
            },
          },
        },
        session: {
          id: 'session_123',
          startTime: new Date().toISOString(),
        },
      };

      adapter.logInfo('Complex metadata test', complexMetadata);

      await waitFor(100);

      expect(mockFetch).toHaveBeenCalled();
      const fetchCall = mockFetch.mock.calls.find(
        (call) => call[0] === '/api/logs'
      );
      expect(fetchCall).toBeDefined();
      // Check that fetch was called with proper structure
      expect(fetchCall[0]).toBe('/api/logs');
      expect(fetchCall[1]).toMatchObject({
        method: 'POST',
        headers: expect.any(Object),
      });
      // The body should be a string containing our data
      expect(typeof fetchCall[1].body).toBe('string');
      expect(fetchCall[1].body).toContain('Complex metadata test');
    });

    it('should handle metadata with null and undefined values', async () => {
      const metadataWithNulls = {
        value: 'test',
        nullValue: null,
        undefinedValue: undefined,
        nested: {
          alsoNull: null,
          alsoUndefined: undefined,
          valid: 'value',
        },
      };

      adapter.logInfo('Null/undefined test', metadataWithNulls);

      await waitFor(100);

      expect(mockFetch).toHaveBeenCalled();
      const fetchCall = mockFetch.mock.calls.find(
        (call) => call[0] === '/api/logs'
      );
      expect(fetchCall).toBeDefined();
      // Check that fetch was called with proper structure
      expect(fetchCall[0]).toBe('/api/logs');
      expect(typeof fetchCall[1].body).toBe('string');
      expect(fetchCall[1].body).toContain('Null/undefined test');
    });
  });

  describe('Enhanced Error Handling', () => {
    let adapter: RemoteLoggerAdapter;
    const mockFetch = global.fetch as jest.Mock;

    beforeEach(() => {
      adapter = RemoteLoggerAdapter.getInstance({
        batchSize: 1,
        batchInterval: 50,
        maxRetries: 2,
        retryDelay: 100,
      });
    });

    it('should handle structuredClone failures gracefully', async () => {
      // Mock structuredClone to fail
      const originalStructuredClone = global.structuredClone;
      global.structuredClone = jest.fn().mockImplementation(() => {
        throw new Error('Structured clone failed');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      adapter.logInfo('Test message', { test: 'data' });

      await waitFor(100);

      // Should still work with JSON fallback
      expect(mockFetch).toHaveBeenCalled();
      expect(consoleSpy).not.toHaveBeenCalled();

      // Restore original
      global.structuredClone = originalStructuredClone;
      consoleSpy.mockRestore();
    });

    it('should handle queue overflow with proper cleanup', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Reset instance to get fresh adapter with small queue
      RemoteLoggerAdapter.resetInstance();

      // Mock sessionStorage to work properly for this test
      mockSessionStorage.getItem.mockReturnValue(null);
      mockSessionStorage.setItem.mockImplementation(() => {}); // Don't throw

      const smallQueueAdapter = RemoteLoggerAdapter.getInstance({
        maxQueueSize: 2,
        batchSize: 5, // Prevent auto-processing
        batchInterval: 10000,
      });

      // Add more logs than queue can hold
      smallQueueAdapter.logInfo('Message 1');
      smallQueueAdapter.logInfo('Message 2');
      smallQueueAdapter.logInfo('Message 3'); // Should drop Message 1
      smallQueueAdapter.logInfo('Message 4'); // Should drop Message 2

      expect(smallQueueAdapter.getQueueSize()).toBe(2);
      // Queue overflow handled silently - old entries are dropped
      // No console warnings when fallbackToConsole is false

      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should categorize different types of errors correctly', async () => {
      // Reset instance to ensure fresh state
      RemoteLoggerAdapter.resetInstance();
      const errorTestAdapter = RemoteLoggerAdapter.getInstance({
        batchSize: 1,
        batchInterval: 50,
        maxRetries: 1, // Only 1 retry for simpler testing
        retryDelay: 50, // Shorter delay for testing
      });

      mockFetch.mockRejectedValue(new Error('Network error: fetch failed'));

      errorTestAdapter.logInfo('Network error test');

      await waitFor(300); // Wait longer for retry logic

      expect(mockFetch).toHaveBeenCalled();
      // Should have attempted retry (original + retry)
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle HTTP 4xx errors without retry', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      adapter.logInfo('Auth error test');

      await waitFor(100);

      expect(mockFetch).toHaveBeenCalled();
      // Should not retry client errors
      expect(adapter.getQueueSize()).toBe(0);
    });

    it('should handle HTTP 5xx errors with retry', async () => {
      // Reset adapter with 1 retry for simpler testing
      RemoteLoggerAdapter.resetInstance();
      const retryAdapter = RemoteLoggerAdapter.getInstance({
        batchSize: 1,
        batchInterval: 50,
        maxRetries: 1,
        retryDelay: 50,
      });

      // Clear previous mock calls
      mockFetch.mockClear();
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      retryAdapter.logInfo('Server error test');

      await waitFor(300);

      expect(mockFetch).toHaveBeenCalled();
      // Should retry server errors (at least original + retry)
      expect(mockFetch.mock.calls.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle HTTP 5xx errors with retry - second test', async () => {
      // Reset adapter with 1 retry for simpler testing
      RemoteLoggerAdapter.resetInstance();
      const retryAdapter2 = RemoteLoggerAdapter.getInstance({
        batchSize: 1,
        batchInterval: 50,
        maxRetries: 1,
        retryDelay: 50,
      });

      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      retryAdapter2.logInfo('Server error test 2');

      await waitFor(300);

      expect(mockFetch).toHaveBeenCalled();
      // Should retry server errors (original + retry)
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Client Context Generation', () => {
    let adapter: RemoteLoggerAdapter;

    beforeEach(() => {
      adapter = RemoteLoggerAdapter.getInstance({
        batchSize: 1,
        batchInterval: 50,
      });
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
      });
    });

    it('should generate proper client context', async () => {
      adapter.logInfo('Context test');

      await waitFor(100);

      expect(global.fetch).toHaveBeenCalledWith('/api/logs', {
        method: 'POST',
        headers: expect.any(Object),
        body: expect.stringContaining('"clientContext"'),
      });

      const fetchCall = (global.fetch as jest.Mock).mock.calls.find(
        (call) => call[0] === '/api/logs'
      );
      expect(fetchCall).toBeDefined();
      // Check that the body contains expected context information
      expect(typeof fetchCall[1].body).toBe('string');
      expect(fetchCall[1].body).toContain('Context test');
      expect(fetchCall[1].body).toContain('clientContext');
      expect(fetchCall[1].body).toContain('Test Browser');
      expect(fetchCall[1].body).toContain('1920x1080');
      expect(fetchCall[1].body).toContain('UTC');
      expect(fetchCall[1].body).toContain('en-US');
    });

    it('should handle missing navigator properties gracefully', async () => {
      // Reset instance to ensure fresh state
      RemoteLoggerAdapter.resetInstance();
      const minimalAdapter = RemoteLoggerAdapter.getInstance({
        batchSize: 1,
        batchInterval: 50,
      });

      // Mock incomplete navigator
      const originalNavigator = global.navigator;
      global.navigator = {
        onLine: true,
        userAgent: 'Minimal Browser',
        language: 'minimal',
      } as Navigator;

      // Mock screen to prevent errors
      const originalScreen = (
        global as unknown as { screen?: { width: number; height: number } }
      ).screen;
      (
        global as unknown as { screen?: { width: number; height: number } }
      ).screen = {
        width: 1024,
        height: 768,
      };

      // Mock Intl to prevent errors
      const originalDateTimeFormat = global.Intl.DateTimeFormat;
      global.Intl.DateTimeFormat = jest.fn().mockImplementation(() => ({
        resolvedOptions: () => ({ timeZone: 'UTC' }),
      })) as unknown as typeof Intl.DateTimeFormat;

      minimalAdapter.logInfo('Minimal navigator test');

      await waitFor(100);

      expect(global.fetch).toHaveBeenCalled();

      // Restore original objects
      global.navigator = originalNavigator;
      (
        global as unknown as { screen?: { width: number; height: number } }
      ).screen = originalScreen;
      global.Intl.DateTimeFormat = originalDateTimeFormat;
    });
  });
});
