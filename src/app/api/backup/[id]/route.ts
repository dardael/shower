import { NextResponse } from 'next/server';
import { BackupServiceLocator } from '@/infrastructure/container';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(
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

    await backupService.deleteBackup(backup);

    return NextResponse.json({
      message: 'Sauvegarde supprimée avec succès',
      backupId: id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la suppression de la sauvegarde',
      },
      { status: 500 }
    );
  }
}
