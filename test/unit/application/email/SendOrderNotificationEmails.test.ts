import { SendOrderNotificationEmails } from '@/application/email/SendOrderNotificationEmails';
import type { IEmailSettingsRepository } from '@/domain/email/repositories/IEmailSettingsRepository';
import type { IEmailService } from '@/domain/email/services/IEmailService';
import type { PlaceholderReplacer } from '@/infrastructure/email/services/PlaceholderReplacer';
import { Order } from '@/domain/order/entities/Order';
import { EmailSettings } from '@/domain/email/entities/EmailSettings';
import { EmailTemplate } from '@/domain/email/entities/EmailTemplate';
import { SmtpSettings } from '@/domain/email/entities/SmtpSettings';
import { ENCRYPTION_TYPES } from '@/domain/email/value-objects/EncryptionType';

describe('SendOrderNotificationEmails', () => {
  let useCase: SendOrderNotificationEmails;
  let mockRepository: jest.Mocked<IEmailSettingsRepository>;
  let mockEmailService: jest.Mocked<IEmailService>;
  let mockPlaceholderReplacer: jest.Mocked<PlaceholderReplacer>;

  const createMockOrder = (): Order => {
    return Order.create(
      {
        customerFirstName: 'Jean',
        customerLastName: 'Dupont',
        customerEmail: 'jean.dupont@example.com',
        customerPhone: '0612345678',
        items: [
          {
            productId: 'prod-1',
            productName: 'T-shirt Bleu',
            quantity: 2,
            unitPrice: 25.99,
          },
        ],
      },
      'order-123'
    );
  };

  const createMockEmailSettings = (): EmailSettings => {
    return EmailSettings.create({
      administratorEmail: 'admin@example.com',
    });
  };

  const createMockTemplate = (
    type: 'admin' | 'purchaser',
    enabled: boolean
  ): EmailTemplate => {
    return EmailTemplate.create({
      type,
      subject: `Commande {{order_id}} - ${type}`,
      body: 'Bonjour {{customer_firstname}}, merci pour votre commande.',
      enabled,
    });
  };

  const createMockSmtpSettings = (): SmtpSettings => {
    return SmtpSettings.create({
      host: 'smtp.example.com',
      port: 587,
      username: 'shop@example.com',
      password: 'password123',
      encryptionType: ENCRYPTION_TYPES.TLS,
    });
  };

  beforeEach(() => {
    mockRepository = {
      getSmtpSettings: jest.fn(),
      saveSmtpSettings: jest.fn(),
      getEmailSettings: jest.fn(),
      saveEmailSettings: jest.fn(),
      getEmailTemplate: jest.fn(),
      saveEmailTemplate: jest.fn(),
      saveEmailLog: jest.fn(),
      getEmailLogs: jest.fn(),
    };

    mockEmailService = {
      sendEmail: jest.fn(),
      testConnection: jest.fn(),
    };

    mockPlaceholderReplacer = {
      replacePlaceholders: jest.fn((template: string) =>
        template.replace(/\{\{[^}]+\}\}/g, 'replaced')
      ),
      getAvailablePlaceholders: jest.fn(),
    } as unknown as jest.Mocked<PlaceholderReplacer>;

    useCase = new SendOrderNotificationEmails(
      mockRepository,
      mockEmailService,
      mockPlaceholderReplacer
    );
  });

  describe('when notifications are enabled', () => {
    it('should send admin email when admin notification is enabled', async () => {
      const order = createMockOrder();
      const emailSettings = createMockEmailSettings();
      const smtpSettings = createMockSmtpSettings();
      const adminTemplate = createMockTemplate('admin', true);
      const purchaserTemplate = createMockTemplate('purchaser', false);

      mockRepository.getSmtpSettings.mockResolvedValue(smtpSettings);
      mockRepository.getEmailSettings.mockResolvedValue(emailSettings);
      mockRepository.getEmailTemplate.mockImplementation(async (type) =>
        type === 'admin' ? adminTemplate : purchaserTemplate
      );
      mockEmailService.sendEmail.mockResolvedValue({ success: true });

      const result = await useCase.execute(order);

      expect(result.adminEmailSent).toBe(true);
      expect(result.purchaserEmailSent).toBe(false);
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1);
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'shop@example.com',
          to: 'admin@example.com',
        })
      );
    });

    it('should send purchaser email when purchaser notification is enabled', async () => {
      const order = createMockOrder();
      const emailSettings = createMockEmailSettings();
      const smtpSettings = createMockSmtpSettings();
      const adminTemplate = createMockTemplate('admin', false);
      const purchaserTemplate = createMockTemplate('purchaser', true);

      mockRepository.getSmtpSettings.mockResolvedValue(smtpSettings);
      mockRepository.getEmailSettings.mockResolvedValue(emailSettings);
      mockRepository.getEmailTemplate.mockImplementation(async (type) =>
        type === 'admin' ? adminTemplate : purchaserTemplate
      );
      mockEmailService.sendEmail.mockResolvedValue({ success: true });

      const result = await useCase.execute(order);

      expect(result.adminEmailSent).toBe(false);
      expect(result.purchaserEmailSent).toBe(true);
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1);
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'shop@example.com',
          to: 'jean.dupont@example.com',
        })
      );
    });

    it('should send both emails when both notifications are enabled', async () => {
      const order = createMockOrder();
      const emailSettings = createMockEmailSettings();
      const smtpSettings = createMockSmtpSettings();
      const adminTemplate = createMockTemplate('admin', true);
      const purchaserTemplate = createMockTemplate('purchaser', true);

      mockRepository.getSmtpSettings.mockResolvedValue(smtpSettings);
      mockRepository.getEmailSettings.mockResolvedValue(emailSettings);
      mockRepository.getEmailTemplate.mockImplementation(async (type) =>
        type === 'admin' ? adminTemplate : purchaserTemplate
      );
      mockEmailService.sendEmail.mockResolvedValue({ success: true });

      const result = await useCase.execute(order);

      expect(result.adminEmailSent).toBe(true);
      expect(result.purchaserEmailSent).toBe(true);
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2);
    });
  });

  describe('when notifications are disabled', () => {
    it('should not send admin email when admin notification is disabled', async () => {
      const order = createMockOrder();
      const emailSettings = createMockEmailSettings();
      const smtpSettings = createMockSmtpSettings();
      const adminTemplate = createMockTemplate('admin', false);
      const purchaserTemplate = createMockTemplate('purchaser', false);

      mockRepository.getSmtpSettings.mockResolvedValue(smtpSettings);
      mockRepository.getEmailSettings.mockResolvedValue(emailSettings);
      mockRepository.getEmailTemplate.mockImplementation(async (type) =>
        type === 'admin' ? adminTemplate : purchaserTemplate
      );

      const result = await useCase.execute(order);

      expect(result.adminEmailSent).toBe(false);
      expect(result.purchaserEmailSent).toBe(false);
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
    });

    it('should not send purchaser email when purchaser notification is disabled', async () => {
      const order = createMockOrder();
      const emailSettings = createMockEmailSettings();
      const smtpSettings = createMockSmtpSettings();
      const adminTemplate = createMockTemplate('admin', true);
      const purchaserTemplate = createMockTemplate('purchaser', false);

      mockRepository.getSmtpSettings.mockResolvedValue(smtpSettings);
      mockRepository.getEmailSettings.mockResolvedValue(emailSettings);
      mockRepository.getEmailTemplate.mockImplementation(async (type) =>
        type === 'admin' ? adminTemplate : purchaserTemplate
      );
      mockEmailService.sendEmail.mockResolvedValue({ success: true });

      const result = await useCase.execute(order);

      expect(result.adminEmailSent).toBe(true);
      expect(result.purchaserEmailSent).toBe(false);
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('when SMTP settings are not configured', () => {
    it('should return error when SMTP settings are missing', async () => {
      const order = createMockOrder();

      mockRepository.getSmtpSettings.mockResolvedValue(
        null as unknown as SmtpSettings
      );
      mockRepository.getEmailSettings.mockResolvedValue(
        createMockEmailSettings()
      );
      mockRepository.getEmailTemplate.mockResolvedValue(
        createMockTemplate('admin', true)
      );

      const result = await useCase.execute(order);

      expect(result.adminEmailSent).toBe(false);
      expect(result.purchaserEmailSent).toBe(false);
      expect(result.adminError).toBe('SMTP settings not configured');
      expect(result.purchaserError).toBe('SMTP settings not configured');
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
    });
  });

  describe('when email settings are not configured', () => {
    it('should return error when email settings are missing', async () => {
      const order = createMockOrder();
      const smtpSettings = createMockSmtpSettings();

      mockRepository.getSmtpSettings.mockResolvedValue(smtpSettings);
      mockRepository.getEmailSettings.mockResolvedValue(
        null as unknown as EmailSettings
      );
      mockRepository.getEmailTemplate.mockResolvedValue(
        createMockTemplate('admin', true)
      );

      const result = await useCase.execute(order);

      expect(result.adminEmailSent).toBe(false);
      expect(result.purchaserEmailSent).toBe(false);
      expect(result.adminError).toBe('Email settings not configured');
      expect(result.purchaserError).toBe('Email settings not configured');
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
    });
  });

  describe('when email sending fails', () => {
    it('should log failure when admin email fails to send', async () => {
      const order = createMockOrder();
      const emailSettings = createMockEmailSettings();
      const smtpSettings = createMockSmtpSettings();
      const adminTemplate = createMockTemplate('admin', true);

      mockRepository.getSmtpSettings.mockResolvedValue(smtpSettings);
      mockRepository.getEmailSettings.mockResolvedValue(emailSettings);
      mockRepository.getEmailTemplate.mockImplementation(async (type) =>
        type === 'admin'
          ? adminTemplate
          : createMockTemplate('purchaser', false)
      );
      mockEmailService.sendEmail.mockResolvedValue({
        success: false,
        errorMessage: 'SMTP connection failed',
      });

      const result = await useCase.execute(order);

      expect(result.adminEmailSent).toBe(false);
      expect(result.adminError).toBe('SMTP connection failed');
      expect(mockRepository.saveEmailLog).toHaveBeenCalled();
    });

    it('should continue sending purchaser email even if admin email fails', async () => {
      const order = createMockOrder();
      const emailSettings = createMockEmailSettings();
      const smtpSettings = createMockSmtpSettings();
      const adminTemplate = createMockTemplate('admin', true);
      const purchaserTemplate = createMockTemplate('purchaser', true);

      mockRepository.getSmtpSettings.mockResolvedValue(smtpSettings);
      mockRepository.getEmailSettings.mockResolvedValue(emailSettings);
      mockRepository.getEmailTemplate.mockImplementation(async (type) =>
        type === 'admin' ? adminTemplate : purchaserTemplate
      );
      mockEmailService.sendEmail
        .mockResolvedValueOnce({
          success: false,
          errorMessage: 'Admin email failed',
        })
        .mockResolvedValueOnce({ success: true });

      const result = await useCase.execute(order);

      expect(result.adminEmailSent).toBe(false);
      expect(result.purchaserEmailSent).toBe(true);
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2);
    });
  });

  describe('placeholder replacement', () => {
    it('should replace placeholders in email subject and body', async () => {
      const order = createMockOrder();
      const emailSettings = createMockEmailSettings();
      const smtpSettings = createMockSmtpSettings();
      const adminTemplate = createMockTemplate('admin', true);

      mockRepository.getSmtpSettings.mockResolvedValue(smtpSettings);
      mockRepository.getEmailSettings.mockResolvedValue(emailSettings);
      mockRepository.getEmailTemplate.mockImplementation(async (type) =>
        type === 'admin'
          ? adminTemplate
          : createMockTemplate('purchaser', false)
      );
      mockEmailService.sendEmail.mockResolvedValue({ success: true });

      await useCase.execute(order);

      expect(mockPlaceholderReplacer.replacePlaceholders).toHaveBeenCalledWith(
        adminTemplate.subject,
        order
      );
      expect(mockPlaceholderReplacer.replacePlaceholders).toHaveBeenCalledWith(
        adminTemplate.body,
        order
      );
    });
  });
});
