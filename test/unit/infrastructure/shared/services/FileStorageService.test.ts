import { LocalFileStorageService } from '@/infrastructure/shared/services/FileStorageService';
import { promises as fsPromises } from 'fs';
import type { Stats } from 'fs';

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
    stat: jest.fn(),
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
      mockFs.stat.mockResolvedValue({ size: 4 } as Stats);

      const result = await fileStorageService.uploadIcon(mockFile);

      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('metadata');
      expect(result.url).toContain('/api/icons/favicon-');
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
