import { injectable, inject } from 'tsyringe';
import * as cron from 'node-cron';
import type { IBackupConfigurationRepository } from '@/domain/backup/ports/IBackupConfigurationRepository';
import type { IDatabaseBackupService } from '@/domain/backup/ports/IDatabaseBackupService';
import type { IBackupScheduler } from '@/domain/backup/ports/IBackupScheduler';
import type { ILogger } from '@/application/shared/ILogger';

// Shared state to prevent duplicate cron jobs during hot-reload
const schedulerState = {
  cronJob: null as cron.ScheduledTask | null,
  isInitialized: false,
};

@injectable()
export class BackupSchedulerService implements IBackupScheduler {
  constructor(
    @inject('IBackupConfigurationRepository')
    private readonly configRepository: IBackupConfigurationRepository,
    @inject('IDatabaseBackupService')
    private readonly backupService: IDatabaseBackupService,
    @inject('ILogger')
    private readonly logger: ILogger
  ) {}

  async start(): Promise<void> {
    if (schedulerState.isInitialized) {
      return;
    }

    const config = await this.configRepository.get();
    if (config.enabled) {
      this.scheduleBackup(config.scheduledHour, config.timezone);
    }

    schedulerState.isInitialized = true;
  }

  stop(): void {
    this.stopSchedule();
    schedulerState.isInitialized = false;
  }

  async updateSchedule(): Promise<void> {
    // Stop existing job
    this.stopSchedule();

    // Get current config and reschedule if enabled
    const config = await this.configRepository.get();
    if (config.enabled) {
      this.scheduleBackup(config.scheduledHour, config.timezone);
    }
  }

  private scheduleBackup(hour: number, timezone: string): void {
    const cronExpression = `0 ${hour} * * *`;

    schedulerState.cronJob = cron.schedule(
      cronExpression,
      async () => {
        try {
          this.logger.logInfo(
            `Démarrage de la sauvegarde programmée à ${hour}h`
          );
          await this.backupService.createBackup();

          // Update last backup timestamp
          const config = await this.configRepository.get();
          const updatedConfig = config.withLastBackupAt(new Date());
          await this.configRepository.save(updatedConfig);

          // Apply retention policy
          await this.backupService.enforceRetentionLimit(config.retentionCount);

          this.logger.logInfo('Sauvegarde programmée terminée avec succès');
        } catch (error) {
          this.logger.logError(
            `Erreur lors de la sauvegarde programmée: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      },
      {
        timezone,
      }
    );

    this.logger.logInfo(
      `Sauvegarde programmée configurée pour ${hour}h (${timezone})`
    );
  }

  private stopSchedule(): void {
    if (schedulerState.cronJob) {
      schedulerState.cronJob.stop();
      schedulerState.cronJob = null;
    }
  }

  isScheduled(): boolean {
    return schedulerState.cronJob !== null;
  }
}
