import { LocalFileStorageService } from '@/infrastructure/shared/services/FileStorageService';
import { promises as fsPromises } from 'fs';

// Mock the container to avoid BetterAuth import issues
jest.mock('@/infrastructure/container', () => ({
  container: {
    resolve: jest.fn().mockReturnValue({
      execute: jest.fn(),
      logInfo: jest.fn(),
      logWarning: jest.fn(),
      logError: jest.fn(),
      logErrorWithObject: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    }),
  },
}));

// Mock the fs module to avoid actual file operations in tests
jest.mock('fs', () => ({
  promises: {
    access: jest.fn(),
    writeFile: jest.fn(),
    mkdir: jest.fn(),
    unlink: jest.fn(),
  },
}));

// Mock path module
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
  normalize: jest.fn((path) => path),
}));

describe('LocalFileStorageService', () => {
  let fileStorageService: LocalFileStorageService;
  let mockFs: jest.Mocked<typeof fsPromises>;

  beforeEach(() => {
    jest.clearAllMocks();
    fileStorageService = new LocalFileStorageService();
    mockFs = jest.mocked(fsPromises);
  });

  describe('uploadIcon', () => {
    it('should upload a valid icon file successfully', async () => {
      // Create a mock file with arrayBuffer method
      const mockArrayBuffer = new ArrayBuffer(4);
      const mockFile = {
        name: 'favicon.ico',
        type: 'image/x-icon',
        size: 4,
        arrayBuffer: jest.fn().mockResolvedValue(mockArrayBuffer),
      } as unknown as File;

      // Mock fs operations
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.writeFile.mockResolvedValue(undefined);

      const result = await fileStorageService.uploadIcon(mockFile);

      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('metadata');
      expect(result.url).toContain('/api/icons/favicon-');
      expect(result.url).toContain('.ico');
      expect(result.metadata.filename).toContain('favicon-');
      expect(result.metadata.originalName).toBe('favicon.ico');
      expect(result.metadata.format).toBe('ico');
      expect(result.metadata.mimeType).toBe('image/x-icon');
      expect(result.metadata.size).toBe(4);
      expect(result.metadata.uploadedAt).toBeInstanceOf(Date);
      expect(mockFs.writeFile).toHaveBeenCalled();
    });

    it('should reject invalid file types', async () => {
      const mockFile = {
        name: 'document.pdf',
        type: 'application/pdf',
        size: 4,
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(4)),
      } as unknown as File;

      await expect(fileStorageService.uploadIcon(mockFile)).rejects.toThrow(
        'Invalid file type. Only ICO, PNG, JPG, SVG, GIF, and WebP files are allowed.'
      );
    });

    it('should reject files that are too large', async () => {
      // Create a mock file larger than 2MB
      const largeArrayBuffer = new ArrayBuffer(3 * 1024 * 1024); // 3MB
      const mockFile = {
        name: 'large-icon.png',
        type: 'image/png',
        size: 3 * 1024 * 1024,
        arrayBuffer: jest.fn().mockResolvedValue(largeArrayBuffer),
      } as unknown as File;

      await expect(fileStorageService.uploadIcon(mockFile)).rejects.toThrow(
        'File size must be less than 2MB.'
      );
    });

    it('should handle different valid file formats', async () => {
      const testCases = [
        { name: 'favicon.ico', type: 'image/x-icon', expectedFormat: 'ico' },
        { name: 'icon.png', type: 'image/png', expectedFormat: 'png' },
        { name: 'icon.jpg', type: 'image/jpeg', expectedFormat: 'jpg' },
        { name: 'icon.svg', type: 'image/svg+xml', expectedFormat: 'svg' },
        { name: 'icon.gif', type: 'image/gif', expectedFormat: 'gif' },
        { name: 'icon.webp', type: 'image/webp', expectedFormat: 'webp' },
      ];

      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.writeFile.mockResolvedValue(undefined);

      for (const testCase of testCases) {
        const mockFile = {
          name: testCase.name,
          type: testCase.type,
          size: 4,
          arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(4)),
        } as unknown as File;

        const result = await fileStorageService.uploadIcon(mockFile);

        expect(result.metadata.format).toBe(testCase.expectedFormat);
        expect(result.metadata.mimeType).toBe(testCase.type);
        expect(result.metadata.originalName).toBe(testCase.name);
      }
    });
  });

  describe('deleteIcon', () => {
    it('should delete icon file successfully', async () => {
      mockFs.unlink.mockResolvedValue(undefined);

      await fileStorageService.deleteIcon('favicon-123.ico');

      expect(mockFs.unlink).toHaveBeenCalled();
    });

    it('should handle file not found gracefully', async () => {
      mockFs.unlink.mockRejectedValue(new Error('ENOENT: no such file'));

      // Should not throw error
      await expect(
        fileStorageService.deleteIcon('nonexistent.ico')
      ).resolves.toBeUndefined();

      expect(mockFs.unlink).toHaveBeenCalled();
    });
  });
});
