import { promises as fs } from 'fs';
import path from 'path';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';
import { IIconMetadata } from '@/domain/settings/types/IconMetadata';
import { getBaseUrl } from '@/infrastructure/shared/utils/appUrl';

export interface IFileStorageService {
  uploadIcon(file: File): Promise<{ url: string; metadata: IIconMetadata }>;
  deleteIcon(filename: string): Promise<void>;
}

export class LocalFileStorageService implements IFileStorageService {
  private readonly baseUrl = getBaseUrl();
  private readonly iconsDir = path.join(process.cwd(), 'public', 'icons');

  constructor() {
    // Directory will be ensured before operations
  }

  private async ensureIconsDirectory(): Promise<void> {
    try {
      await fs.access(this.iconsDir);
    } catch {
      await fs.mkdir(this.iconsDir, { recursive: true });
    }
  }

  async uploadIcon(
    file: File
  ): Promise<{ url: string; metadata: IIconMetadata }> {
    // Ensure icons directory exists
    await this.ensureIconsDirectory();

    // Validate file type
    const allowedTypes = [
      'image/x-icon',
      'image/vnd.microsoft.icon',
      'image/png',
      'image/jpeg',
      'image/svg+xml',
      'image/gif',
      'image/webp',
    ];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        'Invalid file type. Only ICO, PNG, JPG, SVG, GIF, and WebP files are allowed.'
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB.');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop() || 'ico';
    const filename = `favicon-${timestamp}-${randomString}.${extension}`;

    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate buffer was created correctly
    if (buffer.length !== file.size) {
      const logger = container.resolve<Logger>('Logger');
      logger.error('Buffer size mismatch', {
        originalSize: file.size,
        bufferSize: buffer.length,
        filename: file.name,
      });
      throw new Error(
        `File buffer conversion failed: expected ${file.size} bytes, got ${buffer.length} bytes`
      );
    }

    // Save file to public/icons directory
    const filePath = path.join(this.iconsDir, filename);
    try {
      await fs.writeFile(filePath, buffer);

      // Verify file was written correctly
      const stats = await fs.stat(filePath);
      const logger = container.resolve<Logger>('Logger');
      logger.debug('Icon file saved successfully', {
        filename,
        filePath,
        size: stats.size,
        originalSize: file.size,
      });
    } catch (writeError) {
      const logger = container.resolve<Logger>('Logger');
      logger.error('Failed to write icon file to disk', {
        filename,
        filePath,
        error: writeError,
      });
      throw new Error(
        `Failed to save icon file: ${writeError instanceof Error ? writeError.message : 'Unknown error'}`
      );
    }

    // Return URL that will be served by the API route
    const url = `${this.baseUrl}/api/icons/${filename}`;

    const metadata: IIconMetadata = {
      filename,
      originalName: file.name,
      size: file.size,
      format: extension as
        | 'ico'
        | 'png'
        | 'jpg'
        | 'jpeg'
        | 'svg'
        | 'gif'
        | 'webp',
      mimeType: file.type as
        | 'image/x-icon'
        | 'image/png'
        | 'image/jpeg'
        | 'image/svg+xml'
        | 'image/gif'
        | 'image/webp',
      uploadedAt: new Date(),
    };

    const logger = container.resolve<Logger>('Logger');
    logger.debug('Created icon metadata', {
      filename,
      originalName: file.name,
      size: file.size,
      format: extension,
      mimeType: file.type,
      url,
    });

    return { url, metadata };
  }

  async deleteIcon(filename: string): Promise<void> {
    // Ensure icons directory exists
    await this.ensureIconsDirectory();

    try {
      const filePath = path.join(this.iconsDir, filename);
      await fs.unlink(filePath);
      const logger = container.resolve<Logger>('Logger');
      logger.info(`Deleted icon file: ${filename}`);
    } catch (error) {
      const logger = container.resolve<Logger>('Logger');
      logger.logErrorWithObject(
        error,
        `Failed to delete icon file ${filename}`
      );
      // Don't throw error - file might not exist
    }
  }
}
