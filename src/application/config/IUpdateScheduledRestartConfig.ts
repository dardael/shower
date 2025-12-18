import { ScheduledRestartConfig } from '@/domain/config/value-objects/ScheduledRestartConfig';

export interface IUpdateScheduledRestartConfig {
  execute(config: ScheduledRestartConfig): Promise<void>;
}
