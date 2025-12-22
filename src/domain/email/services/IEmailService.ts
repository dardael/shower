export interface SendEmailOptions {
  from: string;
  to: string;
  subject: string;
  body: string;
}

export interface SendEmailResult {
  success: boolean;
  errorMessage?: string;
}

export interface IEmailService {
  sendEmail(options: SendEmailOptions): Promise<SendEmailResult>;
  testConnection(testRecipientEmail: string): Promise<SendEmailResult>;
}
