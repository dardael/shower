import { BackupService } from '@/infrastructure/config/adapters/BackupService';
import { IConfigurationExporter } from '@/domain/config/ports/IConfigurationExporter';
import { ILogger } from '@/application/shared/ILogger';
import * as fs from 'fs';

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  promises: {
    writeFile: jest.fn(),
    readFile: jest.fn(),
    unlink: jest.fn(),
  },
}));

describe('BackupService', () => {
  let mockExporter: jest.Mocked<IConfigurationExporter>;
  let mockLogger: jest.Mocked<ILogger>;
  let backupService: BackupService;

  const mockZipBuffer = Buffer.from('mock-zip-data');

  beforeEach(() => {
    jest.clearAllMocks();

    mockExporter = {
      exportToZip: jest.fn(),
      getExportSummary: jest.fn(),
    };

    mockLogger = {
      logInfo: jest.fn(),
      logError: jest.fn(),
      logWarning: jest.fn(),
      logDebug: jest.fn(),
    };

    backupService = new BackupService(mockExporter, mockLogger);

    // Default mock behavior
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);
    (fs.promises.readFile as jest.Mock).mockResolvedValue(mockZipBuffer);
    (fs.promises.unlink as jest.Mock).mockResolvedValue(undefined);
  });

  describe('createBackup', () => {
    it('should create backup directory if it does not exist', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      mockExporter.exportToZip.mockResolvedValue(mockZipBuffer);

      await backupService.createBackup();

      expect(fs.mkdirSync).toHaveBeenCalledWith(expect.any(String), {
        recursive: true,
      });
    });

    it('should export current configuration and save to file', async () => {
      mockExporter.exportToZip.mockResolvedValue(mockZipBuffer);

      const backupId = await backupService.createBackup();

      expect(mockExporter.exportToZip).toHaveBeenCalled();
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        expect.stringContaining(`backup-${backupId}.zip`),
        mockZipBuffer
      );
    });

    it('should return unique backup ID on success', async () => {
      mockExporter.exportToZip.mockResolvedValue(mockZipBuffer);

      const backupId = await backupService.createBackup();

      expect(backupId).toBeDefined();
      expect(typeof backupId).toBe('string');
      expect(backupId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
    });

    it('should log info on successful backup creation', async () => {
      mockExporter.exportToZip.mockResolvedValue(mockZipBuffer);

      await backupService.createBackup();

      expect(mockLogger.logInfo).toHaveBeenCalledWith(
        'Creating backup before import'
      );
      expect(mockLogger.logInfo).toHaveBeenCalledWith(
        expect.stringContaining('Backup created:')
      );
    });

    it('should return null on export failure', async () => {
      mockExporter.exportToZip.mockRejectedValue(new Error('Export failed'));

      const backupId = await backupService.createBackup();

      expect(backupId).toBeNull();
      expect(mockLogger.logError).toHaveBeenCalledWith(
        expect.stringContaining('Failed to create backup')
      );
    });

    it('should return null on file write failure', async () => {
      mockExporter.exportToZip.mockResolvedValue(mockZipBuffer);
      (fs.promises.writeFile as jest.Mock).mockRejectedValue(
        new Error('Disk full')
      );

      const backupId = await backupService.createBackup();

      expect(backupId).toBeNull();
      expect(mockLogger.logError).toHaveBeenCalled();
    });
  });

  describe('restoreBackup', () => {
    it('should return true when backup file exists', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const result = await backupService.restoreBackup('test-backup-id');

      expect(result).toBe(true);
      expect(mockLogger.logInfo).toHaveBeenCalledWith(
        expect.stringContaining('Restoring from backup')
      );
    });

    it('should return false when backup file does not exist', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const result = await backupService.restoreBackup('missing-backup-id');

      expect(result).toBe(false);
      expect(mockLogger.logError).toHaveBeenCalledWith(
        expect.stringContaining('Backup not found')
      );
    });

    it('should return false on unexpected error', async () => {
      (fs.existsSync as jest.Mock).mockImplementation(() => {
        throw new Error('Permission denied');
      });

      const result = await backupService.restoreBackup('test-backup-id');

      expect(result).toBe(false);
      expect(mockLogger.logError).toHaveBeenCalledWith(
        expect.stringContaining('Failed to restore backup')
      );
    });
  });

  describe('deleteBackup', () => {
    it('should delete backup file when it exists', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      await backupService.deleteBackup('test-backup-id');

      expect(fs.promises.unlink).toHaveBeenCalledWith(
        expect.stringContaining('backup-test-backup-id.zip')
      );
      expect(mockLogger.logInfo).toHaveBeenCalledWith(
        expect.stringContaining('Backup deleted')
      );
    });

    it('should not attempt delete when backup file does not exist', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      await backupService.deleteBackup('missing-backup-id');

      expect(fs.promises.unlink).not.toHaveBeenCalled();
    });

    it('should log warning on delete failure', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.unlink as jest.Mock).mockRejectedValue(
        new Error('Permission denied')
      );

      await backupService.deleteBackup('test-backup-id');

      expect(mockLogger.logWarning).toHaveBeenCalledWith(
        expect.stringContaining('Failed to delete backup')
      );
    });
  });

  describe('getBackupBuffer', () => {
    it('should return buffer when backup file exists', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.readFile as jest.Mock).mockResolvedValue(mockZipBuffer);

      const buffer = await backupService.getBackupBuffer('test-backup-id');

      expect(buffer).toEqual(mockZipBuffer);
    });

    it('should return null when backup file does not exist', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const buffer = await backupService.getBackupBuffer('missing-backup-id');

      expect(buffer).toBeNull();
    });

    it('should return null on read error', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.readFile as jest.Mock).mockRejectedValue(
        new Error('Read error')
      );

      const buffer = await backupService.getBackupBuffer('test-backup-id');

      expect(buffer).toBeNull();
    });
  });

  describe('backup/restore flow integration', () => {
    it('should support complete backup-restore cycle', async () => {
      // Step 1: Create backup
      mockExporter.exportToZip.mockResolvedValue(mockZipBuffer);
      const backupId = await backupService.createBackup();

      expect(backupId).not.toBeNull();

      // Step 2: Verify backup exists
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      const restoreResult = await backupService.restoreBackup(backupId!);

      expect(restoreResult).toBe(true);

      // Step 3: Get backup buffer for actual restore
      const buffer = await backupService.getBackupBuffer(backupId!);

      expect(buffer).toEqual(mockZipBuffer);

      // Step 4: Delete backup after successful import
      await backupService.deleteBackup(backupId!);

      expect(fs.promises.unlink).toHaveBeenCalled();
    });

    it('should handle import failure with backup restore', async () => {
      // Step 1: Create backup before risky import
      mockExporter.exportToZip.mockResolvedValue(mockZipBuffer);
      const backupId = await backupService.createBackup();

      expect(backupId).not.toBeNull();

      // Step 2: Simulate import failure (external to BackupService)
      // The ImportConfiguration use case would catch this and call restoreBackup

      // Step 3: Restore from backup
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      const restoreResult = await backupService.restoreBackup(backupId!);

      expect(restoreResult).toBe(true);

      // Step 4: Get backup buffer and re-import (handled by ImportConfiguration)
      const buffer = await backupService.getBackupBuffer(backupId!);

      expect(buffer).toEqual(mockZipBuffer);
    });
  });
});
