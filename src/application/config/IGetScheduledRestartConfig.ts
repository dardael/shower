import { ScheduledRestartConfig } from '@/domain/config/value-objects/ScheduledRestartConfig';

export interface IGetScheduledRestartConfig {
  execute(): Promise<ScheduledRestartConfig>;
}
