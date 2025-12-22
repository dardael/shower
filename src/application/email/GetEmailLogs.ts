import { injectable, inject } from 'tsyringe';
import type { IEmailSettingsRepository } from '@/domain/email/repositories/IEmailSettingsRepository';
import { EmailLog } from '@/domain/email/entities/EmailLog';

export interface GetEmailLogsOptions {
  page: number;
  limit: number;
  status?: 'sent' | 'failed' | 'all';
  orderId?: string;
}

export interface GetEmailLogsResult {
  logs: EmailLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IGetEmailLogs {
  execute(options: GetEmailLogsOptions): Promise<GetEmailLogsResult>;
}

@injectable()
export class GetEmailLogs implements IGetEmailLogs {
  constructor(
    @inject('IEmailSettingsRepository')
    private readonly repository: IEmailSettingsRepository
  ) {}

  async execute(options: GetEmailLogsOptions): Promise<GetEmailLogsResult> {
    const validatedLimit = Math.min(Math.max(1, options.limit), 100);
    const validatedPage = Math.max(1, options.page);

    const { logs, total } = await this.repository.getEmailLogs({
      page: validatedPage,
      limit: validatedLimit,
      status: options.status,
      orderId: options.orderId,
    });

    return {
      logs,
      total,
      page: validatedPage,
      limit: validatedLimit,
      totalPages: Math.ceil(total / validatedLimit),
    };
  }
}
