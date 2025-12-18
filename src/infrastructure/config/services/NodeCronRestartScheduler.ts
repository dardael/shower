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
      this.logger.info('Restart scheduler config loaded', {
        enabled: config.enabled,
        restartHour: config.restartHour,
        timezone: config.timezone,
      });
      this.schedule(config);
      this.logger.info('Restart scheduler started successfully', {
        enabled: config.enabled,
        restartHour: config.restartHour,
      });
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

    // Use the user's configured timezone (stored when they saved the config)
    const timezone = config.timezone;

    sharedState.scheduledTask = cron.schedule(
      cronExpression,
      () => {
        this.executeRestart();
      },
      {
        timezone,
      }
    );

    this.logger.info(
      `Restart scheduled for ${hour}:00 daily (timezone: ${timezone})`
    );
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

  private async executeRestart(): Promise<void> {
    this.logger.info('Executing scheduled server restart...');

    // Record the restart time before exiting
    try {
      const config = await this.repository.get();
      const updatedConfig = config.withLastRestartAt(new Date());
      await this.repository.save(updatedConfig);
      this.logger.info('Last restart timestamp saved');
    } catch (error) {
      this.logger.error('Failed to save restart timestamp', error);
    }

    // Graceful shutdown - allow a small delay for logging
    setTimeout(() => {
      this.logger.info('Server restart initiated via process.exit(0)');
      // Docker restart policy (restart: unless-stopped) will restart the container
      process.exit(0);
    }, 1000);
  }
}
