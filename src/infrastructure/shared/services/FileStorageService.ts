import { promises as fs } from 'fs';
import path from 'path';
import { inject, injectable } from 'tsyringe';
import type { ILogger } from '@/application/shared/ILogger';
import { IIconMetadata } from '@/domain/settings/types/IconMetadata';
import { getBaseUrl } from '@/infrastructure/shared/utils/appUrl';

export interface IFileStorageService {
  uploadIcon(file: File): Promise<{ url: string; metadata: IIconMetadata }>;
  deleteIcon(filename: string): Promise<void>;
  uploadLogo(file: File): Promise<{ url: string; metadata: IIconMetadata }>;
  deleteLogo(filename: string): Promise<void>;
  uploadPageContentImage(
    file: File
  ): Promise<{ url: string; metadata: IIconMetadata }>;
  deletePageContentImage(filename: string): Promise<void>;
}

interface UploadConfig {
  allowedTypes: string[];
  maxSizeBytes: number;
  filenamePrefix: string;
  defaultExtension: string;
  typeErrorMessage: string;
  sizeErrorMessage: string;
  entityName: string;
}

const ICON_UPLOAD_CONFIG: UploadConfig = {
  allowedTypes: [
    'image/x-icon',
    'image/vnd.microsoft.icon',
    'image/png',
    'image/jpeg',
    'image/svg+xml',
    'image/gif',
    'image/webp',
  ],
  maxSizeBytes: 5 * 1024 * 1024,
  filenamePrefix: 'favicon',
  defaultExtension: 'ico',
  typeErrorMessage:
    'Invalid file type. Only ICO, PNG, JPG, SVG, GIF, and WebP files are allowed.',
  sizeErrorMessage: 'File size must be less than 5MB.',
  entityName: 'icon',
};

const LOGO_UPLOAD_CONFIG: UploadConfig = {
  allowedTypes: [
    'image/png',
    'image/jpeg',
    'image/svg+xml',
    'image/gif',
    'image/webp',
  ],
  maxSizeBytes: 2 * 1024 * 1024,
  filenamePrefix: 'logo',
  defaultExtension: 'png',
  typeErrorMessage:
    'Invalid file type. Only PNG, JPG, SVG, GIF, and WebP formats are allowed.',
  sizeErrorMessage: 'File size too large. Maximum size is 2MB.',
  entityName: 'logo',
};

const PAGE_CONTENT_IMAGE_CONFIG: UploadConfig = {
  allowedTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
  maxSizeBytes: 5 * 1024 * 1024,
  filenamePrefix: 'page-content',
  defaultExtension: 'png',
  typeErrorMessage:
    'Invalid file type. Only PNG, JPG, GIF, and WebP files are allowed.',
  sizeErrorMessage: 'File size must be less than 5MB.',
  entityName: 'page content image',
};

@injectable()
export class LocalFileStorageService implements IFileStorageService {
  private readonly baseUrl = getBaseUrl();
  private readonly iconsDir = path.join(process.cwd(), 'public', 'icons');
  private readonly pageContentImagesDir = path.join(
    process.cwd(),
    'public',
    'page-content-images'
  );

  constructor(@inject('ILogger') private readonly logger: ILogger) {}

  private async ensureDirectory(dir: string): Promise<void> {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  private async uploadImage(
    file: File,
    config: UploadConfig,
    targetDir?: string,
    apiPath?: string
  ): Promise<{ url: string; metadata: IIconMetadata }> {
    const directory = targetDir || this.iconsDir;
    const apiRoute = apiPath || '/api/icons';

    await this.ensureDirectory(directory);

    if (!config.allowedTypes.includes(file.type)) {
      throw new Error(config.typeErrorMessage);
    }

    if (file.size > config.maxSizeBytes) {
      throw new Error(config.sizeErrorMessage);
    }

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop() || config.defaultExtension;
    const filename = `${config.filenamePrefix}-${timestamp}-${randomString}.${extension}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length !== file.size) {
      this.logger.logError('Buffer size mismatch', {
        originalSize: file.size,
        bufferSize: buffer.length,
        filename: file.name,
      });
      throw new Error(
        `File buffer conversion failed: expected ${file.size} bytes, got ${buffer.length} bytes`
      );
    }

    const filePath = path.join(directory, filename);
    try {
      await fs.writeFile(filePath, buffer);

      const stats = await fs.stat(filePath);
      this.logger.logDebug(`${config.entityName} file saved successfully`, {
        filename,
        filePath,
        size: stats.size,
        originalSize: file.size,
      });
    } catch (writeError) {
      this.logger.logError(
        `Failed to write ${config.entityName} file to disk`,
        {
          filename,
          filePath,
          error: writeError,
        }
      );
      throw new Error(
        `Failed to save ${config.entityName} file: ${writeError instanceof Error ? writeError.message : 'Unknown error'}`
      );
    }

    const url = `${this.baseUrl}${apiRoute}/${filename}`;

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
        | 'image/vnd.microsoft.icon'
        | 'image/png'
        | 'image/jpeg'
        | 'image/svg+xml'
        | 'image/gif'
        | 'image/webp',
      uploadedAt: new Date(),
    };

    this.logger.logDebug(`Created ${config.entityName} metadata`, {
      filename,
      originalName: file.name,
      size: file.size,
      format: extension,
      mimeType: file.type,
      url,
    });

    return { url, metadata };
  }

  private async deleteImage(
    filename: string,
    entityName: string,
    targetDir?: string
  ): Promise<void> {
    const directory = targetDir || this.iconsDir;
    await this.ensureDirectory(directory);

    try {
      const filePath = path.join(directory, filename);
      await fs.unlink(filePath);
      this.logger.logInfo(`Deleted ${entityName} file: ${filename}`);
    } catch (error) {
      this.logger.logError(`Failed to delete ${entityName} file ${filename}`, {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async uploadIcon(
    file: File
  ): Promise<{ url: string; metadata: IIconMetadata }> {
    return this.uploadImage(file, ICON_UPLOAD_CONFIG);
  }

  async deleteIcon(filename: string): Promise<void> {
    return this.deleteImage(filename, 'icon');
  }

  async uploadLogo(
    file: File
  ): Promise<{ url: string; metadata: IIconMetadata }> {
    return this.uploadImage(file, LOGO_UPLOAD_CONFIG);
  }

  async deleteLogo(filename: string): Promise<void> {
    return this.deleteImage(filename, 'logo');
  }

  async uploadPageContentImage(
    file: File
  ): Promise<{ url: string; metadata: IIconMetadata }> {
    return this.uploadImage(
      file,
      PAGE_CONTENT_IMAGE_CONFIG,
      this.pageContentImagesDir,
      '/api/page-content-images'
    );
  }

  async deletePageContentImage(filename: string): Promise<void> {
    return this.deleteImage(
      filename,
      'page content image',
      this.pageContentImagesDir
    );
  }
}
