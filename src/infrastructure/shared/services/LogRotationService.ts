import { promises as fs } from 'fs';
import { join } from 'path';
import { gzip } from 'zlib';
import { promisify } from 'util';
import { container } from '@/infrastructure/container';
import type { ILogger } from '@/application/shared/ILogger';

const gzipAsync = promisify(gzip);

export interface LogRotationConfig {
  maxFileSize: number; // bytes
  maxFiles: number;
  compressOldFiles: boolean;
  checkInterval: number; // milliseconds
  compressionLevel: number; // 1-9
  deleteCompressedOlderThan: number; // days
}

export interface RotationMetrics {
  totalRotations: number;
  totalCompressions: number;
  totalDeletions: number;
  lastRotationTime: Date;
  diskSpaceSaved: number; // bytes
  errors: number;
}

export class LogRotationService {
  private rotationTimer?: NodeJS.Timeout;
  private metrics: RotationMetrics;
  private isDestroyed = false;

  constructor(
    private readonly logFolder: string,
    private readonly config: LogRotationConfig
  ) {
    this.metrics = {
      totalRotations: 0,
      totalCompressions: 0,
      totalDeletions: 0,
      lastRotationTime: new Date(),
      diskSpaceSaved: 0,
      errors: 0,
    };
  }

  start(): void {
    if (this.isDestroyed) {
      return;
    }

    this.rotationTimer = setInterval(() => {
      this.performRotation().catch((error) => {
        this.handleRotationError('Periodic rotation failed', error);
      });
    }, this.config.checkInterval);

    // Run initial check
    this.performRotation().catch((error) => {
      this.handleRotationError('Initial rotation check failed', error);
    });
  }

  stop(): void {
    if (this.rotationTimer) {
      clearInterval(this.rotationTimer);
      this.rotationTimer = undefined;
    }
    this.isDestroyed = true;
  }

  private async performRotation(): Promise<void> {
    if (this.isDestroyed) {
      return;
    }

    try {
      const files = await fs.readdir(this.logFolder);
      const logFiles = files
        .filter((file) => file.endsWith('.log') && !file.endsWith('.gz'))
        .map((file) => ({
          name: file,
          path: join(this.logFolder, file),
        }));

      for (const logFile of logFiles) {
        await this.checkAndRotateFile(logFile);
      }

      await this.compressFiles();
      await this.cleanupOldFiles();

      this.metrics.lastRotationTime = new Date();
    } catch (error) {
      this.handleRotationError('Rotation process failed', error);
    }
  }

  private async checkAndRotateFile(logFile: {
    name: string;
    path: string;
  }): Promise<void> {
    try {
      const stats = await fs.stat(logFile.path);

      if (stats.size >= this.config.maxFileSize) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const baseName = logFile.name.replace('.log', '');
        const rotatedName = `${baseName}.${timestamp}.log`;
        const rotatedPath = join(this.logFolder, rotatedName);

        // Move current log to rotated name
        await fs.rename(logFile.path, rotatedPath);

        this.metrics.totalRotations++;
        this.logInfo(`Rotated log file: ${logFile.name} -> ${rotatedName}`, {
          originalSize: stats.size,
          rotatedPath,
        });
      }
    } catch (error) {
      this.handleRotationError(`Failed to rotate file ${logFile.name}`, error);
    }
  }

  private async compressFiles(): Promise<void> {
    if (!this.config.compressOldFiles) {
      return;
    }

    try {
      const files = await fs.readdir(this.logFolder);
      const uncompressedFiles = files.filter(
        (file) =>
          file.endsWith('.log') &&
          !file.includes(new Date().toISOString().split('T')[0])
      );

      for (const file of uncompressedFiles) {
        await this.compressFile(join(this.logFolder, file));
      }
    } catch (error) {
      this.handleRotationError('File compression failed', error);
    }
  }

  private async compressFile(filePath: string): Promise<void> {
    try {
      const stats = await fs.stat(filePath);
      const content = await fs.readFile(filePath);
      const compressed = await gzipAsync(content, {
        level: this.config.compressionLevel,
      });
      const compressedPath = `${filePath}.gz`;

      await fs.writeFile(compressedPath, compressed);
      await fs.unlink(filePath); // Remove uncompressed file

      const spaceSaved = stats.size - compressed.length;
      this.metrics.diskSpaceSaved += spaceSaved;
      this.metrics.totalCompressions++;

      this.logInfo(`Compressed log file: ${filePath}`, {
        originalSize: stats.size,
        compressedSize: compressed.length,
        spaceSaved,
        compressionRatio: ((spaceSaved / stats.size) * 100).toFixed(2) + '%',
      });
    } catch (error) {
      this.handleRotationError(`Failed to compress file ${filePath}`, error);
    }
  }

  private async cleanupOldFiles(): Promise<void> {
    try {
      const files = await fs.readdir(this.logFolder);
      const logFiles = files
        .filter((file) => file.endsWith('.log') || file.endsWith('.log.gz'))
        .map((file) => ({
          name: file,
          path: join(this.logFolder, file),
        }));

      // Sort by creation time (newest first)
      const filesWithStats = await Promise.all(
        logFiles.map(async (file) => {
          const stats = await fs.stat(file.path);
          return { ...file, mtime: stats.mtime, size: stats.size };
        })
      );

      filesWithStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

      // Remove excess files
      if (filesWithStats.length > this.config.maxFiles) {
        const filesToDelete = filesWithStats.slice(this.config.maxFiles);

        for (const file of filesToDelete) {
          await fs.unlink(file.path);
          this.metrics.totalDeletions++;

          this.logInfo(`Deleted old log file: ${file.name}`, {
            age: Date.now() - file.mtime.getTime(),
            size: file.size,
          });
        }
      }

      // Delete compressed files older than specified days
      if (this.config.deleteCompressedOlderThan > 0) {
        const cutoffTime =
          Date.now() -
          this.config.deleteCompressedOlderThan * 24 * 60 * 60 * 1000;
        const oldCompressedFiles = filesWithStats.filter(
          (file) =>
            file.name.endsWith('.gz') && file.mtime.getTime() < cutoffTime
        );

        for (const file of oldCompressedFiles) {
          await fs.unlink(file.path);
          this.metrics.totalDeletions++;

          this.logInfo(`Deleted old compressed file: ${file.name}`, {
            age: Date.now() - file.mtime.getTime(),
            size: file.size,
          });
        }
      }
    } catch (error) {
      this.handleRotationError('Cleanup failed', error);
    }
  }

  private handleRotationError(message: string, error: unknown): void {
    this.metrics.errors++;
    this.logError(`Log rotation error: ${message}`, { error });
  }

  private logInfo(message: string, metadata?: Record<string, unknown>): void {
    try {
      const logger = container.resolve<ILogger>('ILogger');
      logger.logInfo(`[LogRotation] ${message}`, metadata);
    } catch {
      // Logger not available, continue silently
    }
  }

  private logError(message: string, metadata?: Record<string, unknown>): void {
    try {
      const logger = container.resolve<ILogger>('ILogger');
      logger.logError(`[LogRotation] ${message}`, metadata);
    } catch {
      // Logger not available, continue silently
    }
  }

  // Public API for monitoring
  getMetrics(): RotationMetrics {
    return { ...this.metrics };
  }

  async getDiskUsage(): Promise<{ totalSize: number; fileCount: number }> {
    try {
      const files = await fs.readdir(this.logFolder);
      const logFiles = files.filter(
        (file) => file.endsWith('.log') || file.endsWith('.log.gz')
      );

      let totalSize = 0;
      for (const file of logFiles) {
        const stats = await fs.stat(join(this.logFolder, file));
        totalSize += stats.size;
      }

      return { totalSize, fileCount: logFiles.length };
    } catch (error) {
      this.handleRotationError('Failed to get disk usage', error);
      return { totalSize: 0, fileCount: 0 };
    }
  }

  async forceRotation(): Promise<void> {
    await this.performRotation();
  }

  destroy(): void {
    this.stop();
  }
}
