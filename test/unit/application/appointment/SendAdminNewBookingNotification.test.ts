import { SendAdminNewBookingNotification } from '@/application/appointment/SendAdminNewBookingNotification';

// Mock dependencies
const mockEmailService = {
  sendEmail: jest.fn(),
};

const mockEmailSettingsRepository = {
  getEmailSettings: jest.fn(),
  getSmtpSettings: jest.fn(),
  getEmailTemplate: jest.fn(),
  saveEmailLog: jest.fn().mockResolvedValue(undefined),
};

const mockAppointmentRepository = {
  findById: jest.fn(),
};

describe('SendAdminNewBookingNotification', () => {
  let useCase: SendAdminNewBookingNotification;

  const mockAppointment = {
    id: 'apt-1',
    activityId: 'activity-1',
    activityName: 'Consultation',
    activityDurationMinutes: 60,
    dateTime: new Date('2024-01-17T10:00:00.000Z'),
    endDateTime: new Date('2024-01-17T11:00:00.000Z'),
    status: { value: 'pending' },
    clientInfo: {
      name: 'Jean Dupont',
      email: 'jean@example.com',
      phone: '0612345678',
      address: '123 Rue Example',
    },
  };

  const mockEmailSettings = {
    administratorEmail: 'admin@example.com',
    isConfigured: () => true,
  };

  const mockSmtpSettings = {
    isConfigured: () => true,
  };

  const mockEmailTemplate = {
    type: 'appointment-admin-new',
    subject:
      'Nouvelle réservation: {{appointment_activity}} - {{customer_name}}',
    body: `Nouvelle réservation de rendez-vous

Un nouveau rendez-vous a été réservé. Voici les détails :

Activité: {{appointment_activity}}
Date: {{appointment_date}}
Heure: {{appointment_time}}
Durée: {{appointment_duration}}

Client:
Nom: {{customer_name}}
Email: {{customer_email}}
Téléphone: {{customer_phone}}
Notes: {{customer_notes}}

Statut: En attente de confirmation

Connectez-vous à l'administration pour confirmer ou annuler ce rendez-vous.`,
    enabled: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new SendAdminNewBookingNotification(
      mockEmailService as never,
      mockEmailSettingsRepository as never,
      mockAppointmentRepository as never
    );
  });

  it('should send notification to admin for new booking', async () => {
    mockAppointmentRepository.findById.mockResolvedValue(mockAppointment);
    mockEmailSettingsRepository.getEmailSettings.mockResolvedValue(
      mockEmailSettings
    );
    mockEmailSettingsRepository.getSmtpSettings.mockResolvedValue(
      mockSmtpSettings
    );
    mockEmailSettingsRepository.getEmailTemplate.mockResolvedValue(
      mockEmailTemplate
    );
    mockEmailService.sendEmail.mockResolvedValue({ success: true });

    const result = await useCase.execute({ appointmentId: 'apt-1' });

    expect(result).toBe(true);
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'admin@example.com',
        to: 'admin@example.com',
        subject: expect.stringContaining('Nouvelle réservation'),
      })
    );
  });

  it('should include client details in email body', async () => {
    mockAppointmentRepository.findById.mockResolvedValue(mockAppointment);
    mockEmailSettingsRepository.getEmailSettings.mockResolvedValue(
      mockEmailSettings
    );
    mockEmailSettingsRepository.getSmtpSettings.mockResolvedValue(
      mockSmtpSettings
    );
    mockEmailSettingsRepository.getEmailTemplate.mockResolvedValue(
      mockEmailTemplate
    );
    mockEmailService.sendEmail.mockResolvedValue({ success: true });

    await useCase.execute({ appointmentId: 'apt-1' });

    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('Jean Dupont'),
      })
    );
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('jean@example.com'),
      })
    );
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('0612345678'),
      })
    );
  });

  it('should include activity and appointment details', async () => {
    mockAppointmentRepository.findById.mockResolvedValue(mockAppointment);
    mockEmailSettingsRepository.getEmailSettings.mockResolvedValue(
      mockEmailSettings
    );
    mockEmailSettingsRepository.getSmtpSettings.mockResolvedValue(
      mockSmtpSettings
    );
    mockEmailSettingsRepository.getEmailTemplate.mockResolvedValue(
      mockEmailTemplate
    );
    mockEmailService.sendEmail.mockResolvedValue({ success: true });

    await useCase.execute({ appointmentId: 'apt-1' });

    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('Consultation'),
      })
    );
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('60 minutes'),
      })
    );
  });

  it('should throw error when appointment not found', async () => {
    mockAppointmentRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ appointmentId: 'apt-1' })).rejects.toThrow(
      'Rendez-vous non trouvé'
    );
  });

  it('should not send email if SMTP not configured', async () => {
    mockAppointmentRepository.findById.mockResolvedValue(mockAppointment);
    mockEmailSettingsRepository.getEmailSettings.mockResolvedValue(
      mockEmailSettings
    );
    mockEmailSettingsRepository.getSmtpSettings.mockResolvedValue({
      isConfigured: () => false,
    });
    mockEmailSettingsRepository.getEmailTemplate.mockResolvedValue(
      mockEmailTemplate
    );

    const result = await useCase.execute({ appointmentId: 'apt-1' });

    expect(result).toBe(false);
    expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
  });

  it('should use French date formatting', async () => {
    mockAppointmentRepository.findById.mockResolvedValue(mockAppointment);
    mockEmailSettingsRepository.getEmailSettings.mockResolvedValue(
      mockEmailSettings
    );
    mockEmailSettingsRepository.getSmtpSettings.mockResolvedValue(
      mockSmtpSettings
    );
    mockEmailSettingsRepository.getEmailTemplate.mockResolvedValue(
      mockEmailTemplate
    );
    mockEmailService.sendEmail.mockResolvedValue({ success: true });

    await useCase.execute({ appointmentId: 'apt-1' });

    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('janvier'),
      })
    );
  });

  it('should handle missing optional client fields', async () => {
    const appointmentWithoutOptionalFields = {
      ...mockAppointment,
      clientInfo: {
        name: 'Jean Dupont',
        email: 'jean@example.com',
      },
    };
    mockAppointmentRepository.findById.mockResolvedValue(
      appointmentWithoutOptionalFields
    );
    mockEmailSettingsRepository.getEmailSettings.mockResolvedValue(
      mockEmailSettings
    );
    mockEmailSettingsRepository.getSmtpSettings.mockResolvedValue(
      mockSmtpSettings
    );
    mockEmailSettingsRepository.getEmailTemplate.mockResolvedValue(
      mockEmailTemplate
    );
    mockEmailService.sendEmail.mockResolvedValue({ success: true });

    const result = await useCase.execute({ appointmentId: 'apt-1' });

    expect(result).toBe(true);
  });

  it('should return false on email send failure', async () => {
    mockAppointmentRepository.findById.mockResolvedValue(mockAppointment);
    mockEmailSettingsRepository.getEmailSettings.mockResolvedValue(
      mockEmailSettings
    );
    mockEmailSettingsRepository.getSmtpSettings.mockResolvedValue(
      mockSmtpSettings
    );
    mockEmailSettingsRepository.getEmailTemplate.mockResolvedValue(
      mockEmailTemplate
    );
    mockEmailService.sendEmail.mockResolvedValue({ success: false });

    const result = await useCase.execute({ appointmentId: 'apt-1' });

    expect(result).toBe(false);
  });
});
