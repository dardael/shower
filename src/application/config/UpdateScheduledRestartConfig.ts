import { injectable, inject } from 'tsyringe';
import type { IScheduledRestartConfigRepository } from '@/domain/config/repositories/IScheduledRestartConfigRepository';
import type { IUpdateScheduledRestartConfig } from '@/application/config/IUpdateScheduledRestartConfig';
import { ScheduledRestartConfig } from '@/domain/config/value-objects/ScheduledRestartConfig';

@injectable()
export class UpdateScheduledRestartConfig
  implements IUpdateScheduledRestartConfig
{
  constructor(
    @inject('IScheduledRestartConfigRepository')
    private readonly repository: IScheduledRestartConfigRepository
  ) {}

  async execute(config: ScheduledRestartConfig): Promise<void> {
    await this.repository.save(config);
  }
}
