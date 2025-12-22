import { EmailTemplateType } from './EmailTemplate';

export type EmailLogStatus = 'sent' | 'failed';

export interface EmailLogData {
  id: string;
  orderId: string;
  type: EmailTemplateType;
  recipient: string;
  subject: string;
  status: EmailLogStatus;
  errorMessage: string | null;
  sentAt: Date;
}

export class EmailLog {
  private constructor(private readonly data: EmailLogData) {}

  static create(data: EmailLogData): EmailLog {
    return new EmailLog(data);
  }

  static createSent(
    orderId: string,
    type: EmailTemplateType,
    recipient: string,
    subject: string
  ): EmailLog {
    return new EmailLog({
      id: crypto.randomUUID(),
      orderId,
      type,
      recipient,
      subject,
      status: 'sent',
      errorMessage: null,
      sentAt: new Date(),
    });
  }

  static createFailed(
    orderId: string,
    type: EmailTemplateType,
    recipient: string,
    subject: string,
    errorMessage: string
  ): EmailLog {
    return new EmailLog({
      id: crypto.randomUUID(),
      orderId,
      type,
      recipient,
      subject,
      status: 'failed',
      errorMessage,
      sentAt: new Date(),
    });
  }

  get id(): string {
    return this.data.id;
  }

  get orderId(): string {
    return this.data.orderId;
  }

  get type(): EmailTemplateType {
    return this.data.type;
  }

  get recipient(): string {
    return this.data.recipient;
  }

  get subject(): string {
    return this.data.subject;
  }

  get status(): EmailLogStatus {
    return this.data.status;
  }

  get errorMessage(): string | null {
    return this.data.errorMessage;
  }

  get sentAt(): Date {
    return this.data.sentAt;
  }

  isFailed(): boolean {
    return this.data.status === 'failed';
  }

  toJSON(): EmailLogData {
    return { ...this.data };
  }
}
