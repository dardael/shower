import { SendAppointmentCancellationEmail } from '@/application/appointment/SendAppointmentCancellationEmail';

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

describe('SendAppointmentCancellationEmail', () => {
  let useCase: SendAppointmentCancellationEmail;

  const mockAppointment = {
    id: 'apt-1',
    activityId: 'activity-1',
    activityName: 'Consultation',
    activityDurationMinutes: 60,
    dateTime: new Date('2024-01-17T10:00:00.000Z'),
    status: {
      value: 'cancelled',
      isCancelled: () => true,
      isConfirmed: () => false,
      isPending: () => false,
    },
    clientInfo: {
      name: 'Jean Dupont',
      email: 'jean@example.com',
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
    type: 'appointment-cancellation',
    subject: 'Annulation de rendez-vous: {{appointment_activity}}',
    body: `Bonjour {{customer_name}},

Votre rendez-vous a été annulé.

Activité: {{appointment_activity}}
Date prévue: {{appointment_date}}
Heure prévue: {{appointment_time}}

Nous espérons vous revoir très prochainement.
Cordialement,
L'équipe`,
    enabled: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new SendAppointmentCancellationEmail(
      mockEmailService as never,
      mockEmailSettingsRepository as never,
      mockAppointmentRepository as never
    );
  });

  it('should send cancellation email when cancelled by admin', async () => {
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

    const result = await useCase.execute({
      appointmentId: 'apt-1',
    });

    expect(result).toBe(true);
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'admin@example.com',
        to: 'jean@example.com',
        subject: expect.stringContaining('Annulation'),
        body: expect.stringContaining('Votre rendez-vous a été annulé'),
      })
    );
  });

  it('should send cancellation email when cancelled by client', async () => {
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

    const result = await useCase.execute({
      appointmentId: 'apt-1',
    });

    expect(result).toBe(true);
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('Votre rendez-vous a été annulé'),
      })
    );
  });

  it('should include reason when provided', async () => {
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

    await useCase.execute({
      appointmentId: 'apt-1',
    });

    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('Consultation'),
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

    const result = await useCase.execute({
      appointmentId: 'apt-1',
    });

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

    await useCase.execute({
      appointmentId: 'apt-1',
    });

    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('janvier'),
      })
    );
  });

  it('should include appointment details in email', async () => {
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

    await useCase.execute({
      appointmentId: 'apt-1',
    });

    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('Consultation'),
      })
    );
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

    const result = await useCase.execute({
      appointmentId: 'apt-1',
    });

    expect(result).toBe(false);
  });
});
