import { injectable, inject } from 'tsyringe';
import type { IScheduledRestartConfigRepository } from '@/domain/config/repositories/IScheduledRestartConfigRepository';
import type { IGetScheduledRestartConfig } from '@/application/config/IGetScheduledRestartConfig';
import { ScheduledRestartConfig } from '@/domain/config/value-objects/ScheduledRestartConfig';

@injectable()
export class GetScheduledRestartConfig implements IGetScheduledRestartConfig {
  constructor(
    @inject('IScheduledRestartConfigRepository')
    private readonly repository: IScheduledRestartConfigRepository
  ) {}

  async execute(): Promise<ScheduledRestartConfig> {
    return this.repository.get();
  }
}
