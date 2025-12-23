import { NextResponse } from 'next/server';
import { BackupServiceLocator } from '@/infrastructure/container';

export async function GET(): Promise<NextResponse> {
  try {
    const backupService = BackupServiceLocator.getDatabaseBackupService();
    const backups = await backupService.listBackups();

    return NextResponse.json({
      backups: backups.map((backup) => ({
        id: backup.id,
        filePath: backup.filePath,
        createdAt: backup.createdAt.toISOString(),
        sizeBytes: backup.sizeBytes,
        status: backup.status,
        error: backup.error,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la récupération des sauvegardes',
      },
      { status: 500 }
    );
  }
}

export async function POST(): Promise<NextResponse> {
  try {
    const backupService = BackupServiceLocator.getDatabaseBackupService();
    const configRepository =
      BackupServiceLocator.getBackupConfigurationRepository();

    const backup = await backupService.createBackup();

    // Update last backup timestamp
    const config = await configRepository.get();
    const updatedConfig = config.withLastBackupAt(new Date());
    await configRepository.save(updatedConfig);

    // Apply retention policy
    await backupService.enforceRetentionLimit(config.retentionCount);

    return NextResponse.json(
      {
        id: backup.id,
        filePath: backup.filePath,
        createdAt: backup.createdAt.toISOString(),
        sizeBytes: backup.sizeBytes,
        status: backup.status,
        error: backup.error,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la création de la sauvegarde',
      },
      { status: 500 }
    );
  }
}
