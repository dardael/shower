import { injectable, inject } from 'tsyringe';
import type { IEmailSettingsRepository } from '@/domain/email/repositories/IEmailSettingsRepository';
import type { EmailTemplate } from '@/domain/email/entities/EmailTemplate';

export type TemplateType = 'admin' | 'purchaser';

export interface IGetEmailTemplate {
  execute(type: TemplateType): Promise<EmailTemplate | null>;
}

@injectable()
export class GetEmailTemplate implements IGetEmailTemplate {
  constructor(
    @inject('IEmailSettingsRepository')
    private readonly repository: IEmailSettingsRepository
  ) {}

  async execute(type: TemplateType): Promise<EmailTemplate | null> {
    return this.repository.getEmailTemplate(type);
  }
}
