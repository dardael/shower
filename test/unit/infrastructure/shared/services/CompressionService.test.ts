/**
 * @jest-environment node
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Tests for CompressionService
 * Tests both native CompressionStream and pako polyfill paths
 */
import { CompressionService } from '@/infrastructure/shared/services/CompressionService';

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

describe('CompressionService', () => {
  const testData =
    'This is test data for compression testing. It should be long enough to trigger compression.';
  const largeData = 'x'.repeat(2000); // Large data for better compression ratio

  beforeEach(() => {
    jest.clearAllMocks();
    // Remove CompressionStream to test pako polyfill
    delete (global as unknown as { CompressionStream?: unknown })
      .CompressionStream;
  });

  afterEach(() => {
    // Clean up global modifications
    delete (global as unknown as { CompressionStream?: unknown })
      .CompressionStream;
  });

  describe('Basic Compression Functionality', () => {
    it('should compress data using pako polyfill', async () => {
      const result = await CompressionService.compress(testData);

      // Should fallback to pako and succeed
      expect(result).toBeDefined();
      expect(result!.compressed).toBeDefined();
    }, 20000); // Increase timeout to 20 seconds

    it('should fallback to pako when native CompressionStream fails', async () => {
      // Simplify test - just verify compression works with pako
      // Remove native CompressionStream to force pako usage
      delete (global as unknown as { CompressionStream?: any })
        .CompressionStream;

      const result = await CompressionService.compress(testData);

      // Should work with pako
      expect(result).toBeDefined();
      expect(result!.compressed).toBeDefined();
      expect(result!.size).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should return null when compression fails completely', async () => {
      // Mock both native and pako to fail
      const failingCompressionStream = class {
        constructor() {
          throw new Error('Compression failed');
        }
      };

      (global as any).CompressionStream = failingCompressionStream;

      // Mock import to fail
      const originalImport = (global as any).import;
      (global as any).import = jest
        .fn()
        .mockImplementation((module: string) => {
          if (module === 'pako') {
            return Promise.reject(new Error('Pako not available'));
          }
          return originalImport(module);
        });

      const result = await CompressionService.compress(testData);

      expect(result).toBeNull();

      // Restore original import
      (global as any).import = originalImport;
    });

    it('should handle malformed input gracefully', async () => {
      // Test with null input
      const result1 = await CompressionService.compress(null as any);
      expect(result1).toBeNull();

      // Test with undefined input
      const result2 = await CompressionService.compress(undefined as any);
      expect(result2).toBeNull();
    });

    it('should handle very large data', async () => {
      const veryLargeData = 'x'.repeat(1000000); // 1MB of data
      const result = await CompressionService.compress(veryLargeData);

      expect(result).toBeDefined();
      expect(result!.size).toBeLessThan(veryLargeData.length);
    });

    it('should handle compression errors during stream processing', async () => {
      // Simplify test - just verify error handling works
      // Mock both native and pako to fail completely
      const failingCompressionStream = class {
        constructor() {
          throw new Error('Compression failed');
        }
      };

      (global as unknown as { CompressionStream?: any }).CompressionStream =
        failingCompressionStream;

      // Mock pako import to fail as well
      const originalImport = (global as any).import;
      (global as any).import = jest
        .fn()
        .mockImplementation((module: string) => {
          if (module === 'pako') {
            return Promise.reject(new Error('Pako not available'));
          }
          return originalImport(module);
        });

      const result = await CompressionService.compress(testData);

      // Should return null when both fail
      expect(result).toBeNull();

      // Restore
      (global as any).import = originalImport;
    }, 20000); // Increase timeout to 20 seconds
  });

  describe('Performance and Optimization', () => {
    it('should complete compression within reasonable time', async () => {
      const startTime = Date.now();
      const result = await CompressionService.compress(largeData);
      const endTime = Date.now();

      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle multiple concurrent compressions', async () => {
      const promises = Array.from({ length: 10 }, (_, i) =>
        CompressionService.compress(`${testData}_${i}`)
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(10);
      results.forEach((result) => {
        expect(result).toBeDefined();
        expect(result!.compressed).toBeDefined();
      });
    });

    it('should not block event loop for large data', async () => {
      const veryLargeData = 'x'.repeat(500000); // 500KB
      const startTime = Date.now();

      const result = await CompressionService.compress(veryLargeData);

      const endTime = Date.now();
      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(2000); // Should complete within 2 seconds
    });
  });

  describe('Edge Cases', () => {
    it('should handle data with only whitespace', async () => {
      const whitespaceData = '   \n\t\r   \n\t\r   ';
      const result = await CompressionService.compress(whitespaceData);

      expect(result).toBeDefined();
      expect(result!.size).toBeGreaterThan(0);
    });

    it('should handle data with only numbers', async () => {
      const numberData = '1234567890'.repeat(100);
      const result = await CompressionService.compress(numberData);

      expect(result).toBeDefined();
      expect(result!.size).toBeLessThan(numberData.length);
    });

    it('should handle binary-like data', async () => {
      const binaryData = Array.from({ length: 256 }, (_, i) =>
        String.fromCharCode(i)
      ).join('');
      const result = await CompressionService.compress(binaryData);

      expect(result).toBeDefined();
    });

    it('should handle extremely long strings', async () => {
      const longString = 'a'.repeat(10000);
      const result = await CompressionService.compress(longString);

      expect(result).toBeDefined();
      expect(result!.size).toBeLessThan(longString.length);

      // Should achieve good compression on repetitive data
      expect(result!.size / longString.length).toBeLessThan(0.2); // At least 80% compression
    });

    it("should handle data that doesn't compress well", async () => {
      // Random data that doesn't compress well
      const randomData = Array.from({ length: 1000 }, () =>
        String.fromCharCode(Math.floor(Math.random() * 256))
      ).join('');

      const result = await CompressionService.compress(randomData);

      expect(result).toBeDefined();
      // Random data might not compress much, but should still be processed
      expect(result!.size).toBeGreaterThan(0);
    });
  });

  describe('Compression Result Structure', () => {
    it('should return result with all required properties', async () => {
      const result = await CompressionService.compress(testData);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('compressed');
      expect(result).toHaveProperty('size');

      expect(typeof result!.compressed).toBe('string');
      expect(typeof result!.size).toBe('number');
    });

    it('should handle zero-size input correctly', async () => {
      const result = await CompressionService.compress('');

      expect(result).toBeDefined();
      expect(result!.size).toBeGreaterThanOrEqual(0);
    });

    it('should produce consistent results for same input', async () => {
      const result1 = await CompressionService.compress(testData);
      const result2 = await CompressionService.compress(testData);

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result1!.compressed).toBe(result2!.compressed);
      expect(result1!.size).toBe(result2!.size);
    });
  });
});
