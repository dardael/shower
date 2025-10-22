import { promises as fs } from 'fs';
import path from 'path';
import type { IIconMetadata } from '@/infrastructure/settings/models/WebsiteSettingsModel';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';

export interface IFileStorageService {
  uploadIcon(file: File): Promise<{ url: string; metadata: IIconMetadata }>;
  deleteIcon(filename: string): Promise<void>;
}

export class LocalFileStorageService implements IFileStorageService {
  private readonly baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
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

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size must be less than 2MB.');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop() || 'ico';
    const filename = `favicon-${timestamp}-${randomString}.${extension}`;

    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save file to public/icons directory
    const filePath = path.join(this.iconsDir, filename);
    await fs.writeFile(filePath, buffer);

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
      logger.logError(error, `Failed to delete icon file ${filename}`);
      // Don't throw error - file might not exist
    }
  }
}
