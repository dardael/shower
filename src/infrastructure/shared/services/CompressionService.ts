/**
 * CompressionService
 *
 * Provides compression functionality with fallback support for older browsers.
 * Uses native CompressionStream API when available, falls back to pako polyfill.
 */

export interface CompressionResult {
  compressed: string;
  size: number;
}

export class CompressionService {
  private static pakoInstance: typeof import('pako') | null = null;
  private static pakoLoadAttempted = false;

  /**
   * Compresses data using native CompressionStream or pako polyfill
   * @param data - String data to compress
   * @returns Compression result or null if compression fails
   */
  static async compress(data: string): Promise<CompressionResult | null> {
    try {
      // Try native CompressionStream first (modern browsers)
      if (typeof CompressionStream !== 'undefined') {
        return await this.compressNative(data);
      }

      // Fall back to pako polyfill (older browsers)
      return await this.compressWithPako(data);
    } catch {
      // Compression failed, caller should fall back to uncompressed
      return null;
    }
  }

  /**
   * Compresses data using native CompressionStream API
   * @param data - String data to compress
   * @returns Compression result
   */
  private static async compressNative(
    data: string
  ): Promise<CompressionResult> {
    const stream = new CompressionStream('gzip');
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();

    writer.write(new TextEncoder().encode(data));
    writer.close();

    const chunks: Uint8Array[] = [];
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) chunks.push(value);
    }

    const compressed = new Uint8Array(
      chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    );
    let offset = 0;
    for (const chunk of chunks) {
      compressed.set(chunk, offset);
      offset += chunk.length;
    }

    return {
      compressed: btoa(String.fromCharCode(...compressed)),
      size: compressed.length,
    };
  }

  /**
   * Compresses data using pako polyfill
   * @param data - String data to compress
   * @returns Compression result
   */
  private static async compressWithPako(
    data: string
  ): Promise<CompressionResult> {
    // Dynamic import to avoid bundle impact when not needed
    if (!this.pakoLoadAttempted) {
      try {
        const pako = await import('pako');
        this.pakoInstance = pako;
      } catch (error) {
        this.pakoLoadAttempted = true;
        throw new Error(`Failed to load pako polyfill: ${error}`);
      }
    }

    if (!this.pakoInstance) {
      throw new Error('Pako polyfill not available');
    }

    // Use pako.gzip which produces compatible output with native CompressionStream
    const compressed = this.pakoInstance.gzip(data);
    return {
      compressed: btoa(String.fromCharCode(...compressed)),
      size: compressed.length,
    };
  }

  /**
   * Checks if compression is supported in the current environment
   * @returns True if either native CompressionStream or pako polyfill is available
   */
  static async isCompressionSupported(): Promise<boolean> {
    if (typeof CompressionStream !== 'undefined') {
      return true;
    }

    // Test if pako can be loaded
    try {
      if (!this.pakoLoadAttempted) {
        await import('pako');
      }
      return true;
    } catch {
      return false;
    }
  }
}
