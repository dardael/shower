import { SendAppointmentReminderEmail } from '@/application/appointment/SendAppointmentReminderEmail';

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
  update: jest.fn(),
  updateWithOptimisticLock: jest.fn(),
};

describe('SendAppointmentReminderEmail', () => {
  let useCase: SendAppointmentReminderEmail;

  const mockAppointment = {
    id: 'apt-1',
    activityId: 'activity-1',
    activityName: 'Consultation',
    activityDurationMinutes: 60,
    dateTime: new Date('2024-01-17T10:00:00.000Z'),
    endDateTime: new Date('2024-01-17T11:00:00.000Z'),
    status: { isConfirmed: () => true },
    reminderSent: false,
    clientInfo: {
      name: 'Jean Dupont',
      email: 'jean@example.com',
    },
    markReminderSent: jest.fn().mockReturnThis(),
  };

  const mockEmailSettings = {
    administratorEmail: 'admin@example.com',
    isConfigured: () => true,
  };

  const mockSmtpSettings = {
    isConfigured: () => true,
  };

  const mockEmailTemplate = {
    type: 'appointment-reminder',
    subject: 'Rappel: Votre rendez-vous {{appointment_activity}}',
    body: `Rappel de rendez-vous

Bonjour {{customer_name}},

Nous vous rappelons que vous avez un rendez-vous. Voici les détails :

Activité: {{appointment_activity}}
Date: {{appointment_date}}
Heure: {{appointment_time}}
Durée: {{appointment_duration}}

Si vous devez annuler ou modifier votre rendez-vous, veuillez nous contacter dès que possible.

À bientôt!`,
    enabled: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new SendAppointmentReminderEmail(
      mockEmailService as never,
      mockEmailSettingsRepository as never,
      mockAppointmentRepository as never
    );
  });

  it('should send reminder email for confirmed appointment', async () => {
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
        to: 'jean@example.com',
        subject: expect.stringContaining('Rappel'),
      })
    );
    expect(
      mockAppointmentRepository.updateWithOptimisticLock
    ).toHaveBeenCalled();
  });

  it('should not send reminder if appointment not confirmed', async () => {
    const pendingAppointment = {
      ...mockAppointment,
      status: { isConfirmed: () => false },
    };
    mockAppointmentRepository.findById.mockResolvedValue(pendingAppointment);

    const result = await useCase.execute({ appointmentId: 'apt-1' });

    expect(result).toBe(false);
    expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
  });

  it('should not send reminder if already sent', async () => {
    const reminderSentAppointment = {
      ...mockAppointment,
      reminderSent: true,
    };
    mockAppointmentRepository.findById.mockResolvedValue(
      reminderSentAppointment
    );

    const result = await useCase.execute({ appointmentId: 'apt-1' });

    expect(result).toBe(false);
    expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
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

  it('should mark reminder as sent after successful email', async () => {
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

    expect(mockAppointment.markReminderSent).toHaveBeenCalled();
    expect(
      mockAppointmentRepository.updateWithOptimisticLock
    ).toHaveBeenCalled();
  });

  it('should not mark reminder as sent if email fails', async () => {
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
    expect(
      mockAppointmentRepository.updateWithOptimisticLock
    ).not.toHaveBeenCalled();
  });
});
