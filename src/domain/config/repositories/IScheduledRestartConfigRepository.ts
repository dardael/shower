import type { ScheduledRestartConfig } from '@/domain/config/value-objects/ScheduledRestartConfig';

/**
 * Repository interface for scheduled restart configuration persistence
 */
export interface IScheduledRestartConfigRepository {
  /**
   * Retrieves the current scheduled restart configuration
   * @returns The current configuration or default if not set
   */
  get(): Promise<ScheduledRestartConfig>;

  /**
   * Saves the scheduled restart configuration
   * @param config The configuration to save
   */
  save(config: ScheduledRestartConfig): Promise<void>;
}
