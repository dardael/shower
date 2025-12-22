import { injectable, inject } from 'tsyringe';
import type { IEmailService } from '@/domain/email/services/IEmailService';
import type { IEmailSettingsRepository } from '@/domain/email/repositories/IEmailSettingsRepository';

export interface TestSmtpConnectionResult {
  success: boolean;
  errorMessage?: string;
}

export interface ITestSmtpConnection {
  execute(): Promise<TestSmtpConnectionResult>;
}

@injectable()
export class TestSmtpConnection implements ITestSmtpConnection {
  constructor(
    @inject('IEmailService')
    private readonly emailService: IEmailService,
    @inject('IEmailSettingsRepository')
    private readonly repository: IEmailSettingsRepository
  ) {}

  async execute(): Promise<TestSmtpConnectionResult> {
    const emailSettings = await this.repository.getEmailSettings();

    if (!emailSettings.administratorEmail) {
      return {
        success: false,
        errorMessage:
          "L'adresse email administrateur doit être configurée pour tester la connexion",
      };
    }

    const result = await this.emailService.testConnection(
      emailSettings.administratorEmail
    );

    return {
      success: result.success,
      errorMessage: result.errorMessage,
    };
  }
}
