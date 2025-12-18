import type { ScheduledRestartConfig } from '@/domain/config/value-objects/ScheduledRestartConfig';

/**
 * Service interface for scheduling server restarts
 */
export interface IRestartScheduler {
  /**
   * Starts the scheduler by loading configuration and scheduling if enabled
   */
  start(): Promise<void>;

  /**
   * Schedules or reschedules the server restart based on configuration
   * @param config The restart configuration
   */
  schedule(config: ScheduledRestartConfig): void;

  /**
   * Stops any scheduled restart
   */
  stop(): void;

  /**
   * Checks if a restart is currently scheduled
   */
  isScheduled(): boolean;
}
