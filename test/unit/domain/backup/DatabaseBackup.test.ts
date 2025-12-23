import {
  DatabaseBackup,
  type BackupStatus,
} from '@/domain/backup/entities/DatabaseBackup';

describe('DatabaseBackup', () => {
  const validUUID = '550e8400-e29b-41d4-a716-446655440000';

  const defaultProps = {
    id: validUUID,
    filePath: '/temp/backups/backup-2025-01-15.dump',
    createdAt: new Date('2025-01-15T02:00:00Z'),
    sizeBytes: 1024000,
    status: 'completed' as BackupStatus,
    error: null,
  };

  describe('create', () => {
    it('should create a backup with all properties', () => {
      const backup = DatabaseBackup.create(defaultProps);

      expect(backup.id).toBe(validUUID);
      expect(backup.filePath).toBe('/temp/backups/backup-2025-01-15.dump');
      expect(backup.createdAt).toEqual(new Date('2025-01-15T02:00:00Z'));
      expect(backup.sizeBytes).toBe(1024000);
      expect(backup.status).toBe('completed');
      expect(backup.error).toBeNull();
    });

    it('should create a backup with error message', () => {
      const backup = DatabaseBackup.create({
        ...defaultProps,
        status: 'failed',
        error: 'Backup failed due to disk space',
      });

      expect(backup.status).toBe('failed');
      expect(backup.error).toBe('Backup failed due to disk space');
    });
  });

  describe('validation', () => {
    it('should throw for invalid UUID', () => {
      expect(() =>
        DatabaseBackup.create({ ...defaultProps, id: 'invalid-id' })
      ).toThrow('id must be a valid UUID v4');
    });

    it('should throw for empty filePath', () => {
      expect(() =>
        DatabaseBackup.create({ ...defaultProps, filePath: '' })
      ).toThrow('filePath must be a non-empty string');
    });

    it('should throw for negative sizeBytes', () => {
      expect(() =>
        DatabaseBackup.create({ ...defaultProps, sizeBytes: -1 })
      ).toThrow('sizeBytes must be a non-negative integer');
    });

    it('should accept zero sizeBytes', () => {
      const backup = DatabaseBackup.create({ ...defaultProps, sizeBytes: 0 });
      expect(backup.sizeBytes).toBe(0);
    });
  });

  describe('isRestorable', () => {
    it('should return true for completed backups', () => {
      const backup = DatabaseBackup.create({
        ...defaultProps,
        status: 'completed',
      });

      expect(backup.isRestorable()).toBe(true);
    });

    it('should return false for failed backups', () => {
      const backup = DatabaseBackup.create({
        ...defaultProps,
        status: 'failed',
        error: 'Some error',
      });

      expect(backup.isRestorable()).toBe(false);
    });
  });

  describe('toData', () => {
    it('should return all backup data', () => {
      const backup = DatabaseBackup.create(defaultProps);

      const data = backup.toData();

      expect(data).toEqual({
        id: validUUID,
        filePath: '/temp/backups/backup-2025-01-15.dump',
        createdAt: new Date('2025-01-15T02:00:00Z'),
        sizeBytes: 1024000,
        status: 'completed',
        error: null,
      });
    });
  });

  describe('toPublicData', () => {
    it('should return data without filePath and error', () => {
      const backup = DatabaseBackup.create(defaultProps);

      const publicData = backup.toPublicData();

      expect(publicData).toEqual({
        id: validUUID,
        createdAt: new Date('2025-01-15T02:00:00Z'),
        sizeBytes: 1024000,
        status: 'completed',
      });
      expect(publicData).not.toHaveProperty('filePath');
      expect(publicData).not.toHaveProperty('error');
    });
  });
});
