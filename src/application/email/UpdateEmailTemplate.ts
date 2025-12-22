import { injectable, inject } from 'tsyringe';
import type { IEmailSettingsRepository } from '@/domain/email/repositories/IEmailSettingsRepository';
import { EmailTemplate } from '@/domain/email/entities/EmailTemplate';

export type TemplateType = 'admin' | 'purchaser';

export interface UpdateEmailTemplateParams {
  type: TemplateType;
  subject: string;
  body: string;
  enabled: boolean;
}

export interface IUpdateEmailTemplate {
  execute(params: UpdateEmailTemplateParams): Promise<void>;
}

@injectable()
export class UpdateEmailTemplate implements IUpdateEmailTemplate {
  constructor(
    @inject('IEmailSettingsRepository')
    private readonly repository: IEmailSettingsRepository
  ) {}

  async execute(params: UpdateEmailTemplateParams): Promise<void> {
    const template = EmailTemplate.create({
      type: params.type,
      subject: params.subject,
      body: params.body,
      enabled: params.enabled,
    });

    await this.repository.saveEmailTemplate(template);
  }
}
