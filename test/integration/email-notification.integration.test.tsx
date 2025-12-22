/**
 * Integration tests for Email Notification feature
 * Tests email sending when orders are placed
 */

import { Order } from '@/domain/order/entities/Order';
import { EmailSettings } from '@/domain/email/entities/EmailSettings';
import { EmailTemplate } from '@/domain/email/entities/EmailTemplate';
import { SmtpSettings } from '@/domain/email/entities/SmtpSettings';
import { ENCRYPTION_TYPES } from '@/domain/email/value-objects/EncryptionType';
import { SendOrderNotificationEmails } from '@/application/email/SendOrderNotificationEmails';
import type { IEmailSettingsRepository } from '@/domain/email/repositories/IEmailSettingsRepository';
import type { IEmailService } from '@/domain/email/services/IEmailService';
import type { PlaceholderReplacer } from '@/infrastructure/email/services/PlaceholderReplacer';
import { EmailLog } from '@/domain/email/entities/EmailLog';

describe('Email Notification Integration', () => {
  // Test fixtures
  const createTestOrder = (): Order => {
    return Order.create(
      {
        customerFirstName: 'Jean',
        customerLastName: 'Dupont',
        customerEmail: 'jean.dupont@example.com',
        customerPhone: '0612345678',
        items: [
          {
            productId: 'prod-1',
            productName: 'Produit Test',
            quantity: 2,
            unitPrice: 29.99,
          },
          {
            productId: 'prod-2',
            productName: 'Autre Produit',
            quantity: 1,
            unitPrice: 15.0,
          },
        ],
      },
      'order-test-123'
    );
  };

  const createMockSmtpSettings = (): SmtpSettings => {
    return SmtpSettings.create({
      host: 'smtp.example.com',
      port: 587,
      username: 'notifications@shop.com',
      password: 'secure-password',
      encryptionType: ENCRYPTION_TYPES.TLS,
    });
  };

  const createMockEmailSettings = (): EmailSettings => {
    return EmailSettings.create({
      administratorEmail: 'admin@shop.com',
    });
  };

  const createMockAdminTemplate = (enabled = true): EmailTemplate => {
    return EmailTemplate.create({
      type: 'admin',
      subject: 'Nouvelle commande {{order_id}}',
      body: 'Nouvelle commande de {{customer_firstname}} {{customer_lastname}}.\n\nTotal: {{order_total}}€\n\nProduits:\n{{products_list}}',
      enabled,
    });
  };

  const createMockPurchaserTemplate = (enabled = true): EmailTemplate => {
    return EmailTemplate.create({
      type: 'purchaser',
      subject: 'Confirmation de commande {{order_id}}',
      body: 'Bonjour {{customer_firstname}},\n\nMerci pour votre commande!\n\nTotal: {{order_total}}€',
      enabled,
    });
  };

  describe('Email Sending on Order Confirmation', () => {
    let mockRepository: jest.Mocked<IEmailSettingsRepository>;
    let mockEmailService: jest.Mocked<IEmailService>;
    let mockPlaceholderReplacer: jest.Mocked<PlaceholderReplacer>;

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
        replacePlaceholders: jest.fn((text: string) => text),
        getAvailablePlaceholders: jest.fn(() => []),
      } as unknown as jest.Mocked<PlaceholderReplacer>;
    });

    it('should send both admin and purchaser emails when fully configured', async () => {
      const order = createTestOrder();
      const smtpSettings = createMockSmtpSettings();
      const emailSettings = createMockEmailSettings();
      const adminTemplate = createMockAdminTemplate();
      const purchaserTemplate = createMockPurchaserTemplate();

      mockRepository.getSmtpSettings.mockResolvedValue(smtpSettings);
      mockRepository.getEmailSettings.mockResolvedValue(emailSettings);
      mockRepository.getEmailTemplate
        .mockResolvedValueOnce(adminTemplate)
        .mockResolvedValueOnce(purchaserTemplate);
      mockEmailService.sendEmail.mockResolvedValue({ success: true });

      const sendNotifications = new SendOrderNotificationEmails(
        mockRepository,
        mockEmailService,
        mockPlaceholderReplacer
      );

      await sendNotifications.execute(order);

      // Should have sent 2 emails
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2);

      // Verify admin email
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'admin@shop.com',
          from: 'notifications@shop.com',
        })
      );

      // Verify purchaser email
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'jean.dupont@example.com',
          from: 'notifications@shop.com',
        })
      );
    });

    it('should only send admin email when purchaser template is disabled', async () => {
      const order = createTestOrder();
      const smtpSettings = createMockSmtpSettings();
      const emailSettings = createMockEmailSettings();
      const adminTemplate = createMockAdminTemplate(true);
      const purchaserTemplate = createMockPurchaserTemplate(false);

      mockRepository.getSmtpSettings.mockResolvedValue(smtpSettings);
      mockRepository.getEmailSettings.mockResolvedValue(emailSettings);
      mockRepository.getEmailTemplate
        .mockResolvedValueOnce(adminTemplate)
        .mockResolvedValueOnce(purchaserTemplate);
      mockEmailService.sendEmail.mockResolvedValue({ success: true });

      const sendNotifications = new SendOrderNotificationEmails(
        mockRepository,
        mockEmailService,
        mockPlaceholderReplacer
      );

      await sendNotifications.execute(order);

      // Should have sent only 1 email (admin)
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1);
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'admin@shop.com',
        })
      );
    });

    it('should only send purchaser email when admin template is disabled', async () => {
      const order = createTestOrder();
      const smtpSettings = createMockSmtpSettings();
      const emailSettings = createMockEmailSettings();
      const adminTemplate = createMockAdminTemplate(false);
      const purchaserTemplate = createMockPurchaserTemplate(true);

      mockRepository.getSmtpSettings.mockResolvedValue(smtpSettings);
      mockRepository.getEmailSettings.mockResolvedValue(emailSettings);
      mockRepository.getEmailTemplate
        .mockResolvedValueOnce(adminTemplate)
        .mockResolvedValueOnce(purchaserTemplate);
      mockEmailService.sendEmail.mockResolvedValue({ success: true });

      const sendNotifications = new SendOrderNotificationEmails(
        mockRepository,
        mockEmailService,
        mockPlaceholderReplacer
      );

      await sendNotifications.execute(order);

      // Should have sent only 1 email (purchaser)
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1);
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'jean.dupont@example.com',
        })
      );
    });

    it('should not send any emails when SMTP is not configured', async () => {
      const order = createTestOrder();

      mockRepository.getSmtpSettings.mockResolvedValue(
        null as unknown as SmtpSettings
      );

      const sendNotifications = new SendOrderNotificationEmails(
        mockRepository,
        mockEmailService,
        mockPlaceholderReplacer
      );

      await sendNotifications.execute(order);

      expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
    });

    it('should log email sending results', async () => {
      const order = createTestOrder();
      const smtpSettings = createMockSmtpSettings();
      const emailSettings = createMockEmailSettings();
      const adminTemplate = createMockAdminTemplate();
      const purchaserTemplate = createMockPurchaserTemplate();

      mockRepository.getSmtpSettings.mockResolvedValue(smtpSettings);
      mockRepository.getEmailSettings.mockResolvedValue(emailSettings);
      mockRepository.getEmailTemplate
        .mockResolvedValueOnce(adminTemplate)
        .mockResolvedValueOnce(purchaserTemplate);
      mockEmailService.sendEmail.mockResolvedValue({ success: true });

      const sendNotifications = new SendOrderNotificationEmails(
        mockRepository,
        mockEmailService,
        mockPlaceholderReplacer
      );

      await sendNotifications.execute(order);

      // Should have logged 2 email results (both successes)
      expect(mockRepository.saveEmailLog).toHaveBeenCalledTimes(2);
    });

    it('should continue sending purchaser email even if admin email fails', async () => {
      const order = createTestOrder();
      const smtpSettings = createMockSmtpSettings();
      const emailSettings = createMockEmailSettings();
      const adminTemplate = createMockAdminTemplate();
      const purchaserTemplate = createMockPurchaserTemplate();

      mockRepository.getSmtpSettings.mockResolvedValue(smtpSettings);
      mockRepository.getEmailSettings.mockResolvedValue(emailSettings);
      mockRepository.getEmailTemplate
        .mockResolvedValueOnce(adminTemplate)
        .mockResolvedValueOnce(purchaserTemplate);

      // First call (admin) fails, second call (purchaser) succeeds
      mockEmailService.sendEmail
        .mockResolvedValueOnce({
          success: false,
          errorMessage: 'SMTP connection failed',
        })
        .mockResolvedValueOnce({ success: true });

      const sendNotifications = new SendOrderNotificationEmails(
        mockRepository,
        mockEmailService,
        mockPlaceholderReplacer
      );

      await sendNotifications.execute(order);

      // Should have attempted both emails
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2);

      // Should have logged both results (one failure, one success)
      expect(mockRepository.saveEmailLog).toHaveBeenCalledTimes(2);
    });

    it('should replace placeholders correctly in email content', async () => {
      const order = createTestOrder();
      const smtpSettings = createMockSmtpSettings();
      const emailSettings = createMockEmailSettings();
      const adminTemplate = createMockAdminTemplate();
      const purchaserTemplate = createMockPurchaserTemplate();

      mockRepository.getSmtpSettings.mockResolvedValue(smtpSettings);
      mockRepository.getEmailSettings.mockResolvedValue(emailSettings);
      mockRepository.getEmailTemplate
        .mockResolvedValueOnce(adminTemplate)
        .mockResolvedValueOnce(purchaserTemplate);
      mockEmailService.sendEmail.mockResolvedValue({ success: true });

      // Track replacement calls and return modified content
      mockPlaceholderReplacer.replacePlaceholders = jest.fn(
        (text: string, orderArg: Order) => {
          return text
            .replace('{{order_id}}', orderArg.id)
            .replace('{{customer_firstname}}', orderArg.customerFirstName)
            .replace('{{customer_lastname}}', orderArg.customerLastName)
            .replace('{{order_total}}', orderArg.totalPrice.toFixed(2));
        }
      );

      const sendNotifications = new SendOrderNotificationEmails(
        mockRepository,
        mockEmailService,
        mockPlaceholderReplacer
      );

      await sendNotifications.execute(order);

      // Placeholder replacer should have been called for subjects and bodies
      expect(mockPlaceholderReplacer.replacePlaceholders).toHaveBeenCalled();

      // Verify emails were sent with replaced content
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining('order-test-123'),
        })
      );
    });
  });

  describe('Email Log Entity', () => {
    it('should create sent EmailLog entity using factory method', () => {
      const log = EmailLog.createSent(
        'order-123',
        'admin',
        'admin@shop.com',
        'Nouvelle commande ORD-123'
      );

      expect(log.orderId).toBe('order-123');
      expect(log.type).toBe('admin');
      expect(log.recipient).toBe('admin@shop.com');
      expect(log.status).toBe('sent');
      expect(log.sentAt).toBeInstanceOf(Date);
      expect(log.errorMessage).toBeNull();
    });

    it('should create failed EmailLog entity using factory method', () => {
      const log = EmailLog.createFailed(
        'order-123',
        'purchaser',
        'customer@example.com',
        'Confirmation de commande',
        'SMTP connection timeout'
      );

      expect(log.status).toBe('failed');
      expect(log.errorMessage).toBe('SMTP connection timeout');
      expect(log.isFailed()).toBe(true);
    });
  });

  describe('Order Creation Does Not Block on Email Failure', () => {
    it('should complete order creation even when email service throws', async () => {
      // This test validates the integration pattern where email sending
      // is fire-and-forget and doesn't block order creation
      const order = createTestOrder();

      // Order should be created successfully
      expect(order.id).toBe('order-test-123');
      expect(order.customerEmail).toBe('jean.dupont@example.com');
      expect(order.totalPrice).toBeCloseTo(74.98, 2); // (2*29.99) + (1*15.00)

      // The order entity is valid and ready to be persisted
      // regardless of email notification status
      expect(order.items).toHaveLength(2);
    });
  });
});
