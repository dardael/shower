'use strict';

import * as cron from 'node-cron';
import { injectable, inject } from 'tsyringe';
import type { IRestartScheduler } from '@/domain/config/services/IRestartScheduler';
import type { ScheduledRestartConfig } from '@/domain/config/value-objects/ScheduledRestartConfig';
import type { IScheduledRestartConfigRepository } from '@/domain/config/repositories/IScheduledRestartConfigRepository';
import { Logger } from '@/application/shared/Logger';

// Shared state to prevent duplicate cron jobs during hot-reload in development
const sharedState = {
  scheduledTask: null as cron.ScheduledTask | null,
  isInitialized: false,
};

@injectable()
export class NodeCronRestartScheduler implements IRestartScheduler {
  private readonly logger: Logger;

  constructor(
    @inject('IScheduledRestartConfigRepository')
    private readonly repository: IScheduledRestartConfigRepository
  ) {
    this.logger = new Logger();
  }

  async start(): Promise<void> {
    // Prevent duplicate initialization during hot-reload
    if (sharedState.isInitialized) {
      this.logger.info('Restart scheduler already initialized, skipping');
      return;
    }
    sharedState.isInitialized = true;

    try {
      const config = await this.repository.get();
      this.schedule(config);
      this.logger.info('Restart scheduler started successfully');
    } catch (error) {
      this.logger.error('Failed to start restart scheduler', error);
    }
  }

  schedule(config: ScheduledRestartConfig): void {
    // Stop any existing schedule first
    this.stop();

    if (!config.enabled) {
      this.logger.info('Scheduled restart is disabled, not scheduling');
      return;
    }

    const hour = config.restartHour;
    // Cron expression: "0 {hour} * * *" means at minute 0 of the specified hour, every day
    const cronExpression = `0 ${hour} * * *`;

    sharedState.scheduledTask = cron.schedule(cronExpression, () => {
      this.executeRestart();
    });

    this.logger.info(`Restart scheduled for ${hour}:00 daily`);
  }

  stop(): void {
    if (sharedState.scheduledTask) {
      sharedState.scheduledTask.stop();
      sharedState.scheduledTask = null;
      this.logger.info('Restart scheduler stopped');
    }
  }

  isScheduled(): boolean {
    return sharedState.scheduledTask !== null;
  }

  private executeRestart(): void {
    this.logger.info('Executing scheduled server restart...');

    // Graceful shutdown - allow a small delay for logging
    setTimeout(() => {
      this.logger.info('Server restart initiated via process.exit(0)');
      // Docker restart policy (restart: unless-stopped) will restart the container
      process.exit(0);
    }, 1000);
  }
}
