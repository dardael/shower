import { NextResponse } from 'next/server';
import { BackupServiceLocator } from '@/infrastructure/container';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(
  _request: Request,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const backupService = BackupServiceLocator.getDatabaseBackupService();

    const backups = await backupService.listBackups();
    const backup = backups.find((b) => b.id === id);

    if (!backup) {
      return NextResponse.json(
        { error: 'Sauvegarde non trouvée' },
        { status: 404 }
      );
    }

    if (!backup.isRestorable()) {
      return NextResponse.json(
        { error: 'Cette sauvegarde ne peut pas être restaurée' },
        { status: 400 }
      );
    }

    await backupService.restoreBackup(backup);

    return NextResponse.json({
      message: 'Sauvegarde restaurée avec succès',
      backupId: id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la restauration de la sauvegarde',
      },
      { status: 500 }
    );
  }
}
