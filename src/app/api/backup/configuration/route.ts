import { NextResponse } from 'next/server';
import { BackupServiceLocator } from '@/infrastructure/container';

export async function GET(): Promise<NextResponse> {
  try {
    const repository = BackupServiceLocator.getBackupConfigurationRepository();
    const config = await repository.get();

    return NextResponse.json({
      enabled: config.enabled,
      scheduledHour: config.scheduledHour,
      retentionCount: config.retentionCount,
      timezone: config.timezone,
      lastBackupAt: config.lastBackupAt?.toISOString() ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la récupération de la configuration',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const repository = BackupServiceLocator.getBackupConfigurationRepository();

    const currentConfig = await repository.get();
    let updatedConfig = currentConfig;

    if (typeof body.enabled === 'boolean') {
      updatedConfig = updatedConfig.withEnabled(body.enabled);
    }
    if (typeof body.scheduledHour === 'number') {
      updatedConfig = updatedConfig.withScheduledHour(body.scheduledHour);
    }
    if (typeof body.retentionCount === 'number') {
      updatedConfig = updatedConfig.withRetentionCount(body.retentionCount);
    }
    if (typeof body.timezone === 'string') {
      updatedConfig = updatedConfig.withTimezone(body.timezone);
    }

    await repository.save(updatedConfig);

    return NextResponse.json({
      enabled: updatedConfig.enabled,
      scheduledHour: updatedConfig.scheduledHour,
      retentionCount: updatedConfig.retentionCount,
      timezone: updatedConfig.timezone,
      lastBackupAt: updatedConfig.lastBackupAt?.toISOString() ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la mise à jour de la configuration',
      },
      { status: 500 }
    );
  }
}
