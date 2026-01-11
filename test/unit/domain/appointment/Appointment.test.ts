import { Appointment } from '@/domain/appointment/entities/Appointment';
import { AppointmentStatus } from '@/domain/appointment/value-objects/AppointmentStatus';
import { ClientInfo } from '@/domain/appointment/value-objects/ClientInfo';

describe('Appointment', () => {
  const validClientInfo = ClientInfo.create({
    name: 'Jean Dupont',
    email: 'jean@example.com',
  });

  const validAppointmentProps = {
    activityId: 'activity-123',
    activityName: 'Consultation',
    activityDurationMinutes: 60,
    clientInfo: validClientInfo,
    dateTime: new Date('2024-01-16T10:00:00.000Z'),
    status: AppointmentStatus.pending(),
  };

  describe('create', () => {
    it('should create an Appointment with valid props', () => {
      const appointment = Appointment.create(validAppointmentProps);

      expect(appointment.activityId).toBe('activity-123');
      expect(appointment.activityName).toBe('Consultation');
      expect(appointment.activityDurationMinutes).toBe(60);
      expect(appointment.clientInfo).toBe(validClientInfo);
      expect(appointment.dateTime).toEqual(
        new Date('2024-01-16T10:00:00.000Z')
      );
      expect(appointment.status.isPending()).toBe(true);
      expect(appointment.id).toBeUndefined();
      expect(appointment.version).toBe(1);
      expect(appointment.reminderSent).toBe(false);
      expect(appointment.createdAt).toBeInstanceOf(Date);
      expect(appointment.updatedAt).toBeInstanceOf(Date);
    });

    it('should trim the activity name', () => {
      const appointment = Appointment.create({
        ...validAppointmentProps,
        activityName: '  Consultation  ',
      });

      expect(appointment.activityName).toBe('Consultation');
    });

    it('should default to pending status if not provided', () => {
      const appointment = Appointment.create({
        ...validAppointmentProps,
        status: undefined as unknown as AppointmentStatus,
      });

      expect(appointment.status.isPending()).toBe(true);
    });

    it('should throw error when activityId is empty', () => {
      expect(() =>
        Appointment.create({
          ...validAppointmentProps,
          activityId: '',
        })
      ).toThrow("L'identifiant de l'activité est requis");
    });

    it('should throw error when activityName is empty', () => {
      expect(() =>
        Appointment.create({
          ...validAppointmentProps,
          activityName: '',
        })
      ).toThrow("Le nom de l'activité est requis");
    });

    it('should throw error when activityName is only whitespace', () => {
      expect(() =>
        Appointment.create({
          ...validAppointmentProps,
          activityName: '   ',
        })
      ).toThrow("Le nom de l'activité est requis");
    });

    it('should throw error when activityDurationMinutes is 0', () => {
      expect(() =>
        Appointment.create({
          ...validAppointmentProps,
          activityDurationMinutes: 0,
        })
      ).toThrow('La durée doit être supérieure à 0 minutes');
    });

    it('should throw error when activityDurationMinutes is negative', () => {
      expect(() =>
        Appointment.create({
          ...validAppointmentProps,
          activityDurationMinutes: -30,
        })
      ).toThrow('La durée doit être supérieure à 0 minutes');
    });

    it('should throw error when dateTime is invalid', () => {
      expect(() =>
        Appointment.create({
          ...validAppointmentProps,
          dateTime: new Date('invalid'),
        })
      ).toThrow('Une date et heure valides sont requises');
    });

    it('should throw error when dateTime is null', () => {
      expect(() =>
        Appointment.create({
          ...validAppointmentProps,
          dateTime: null as unknown as Date,
        })
      ).toThrow('Une date et heure valides sont requises');
    });

    it('should preserve provided id', () => {
      const appointment = Appointment.create({
        ...validAppointmentProps,
        id: 'appointment-123',
      });

      expect(appointment.id).toBe('appointment-123');
    });

    it('should preserve provided version', () => {
      const appointment = Appointment.create({
        ...validAppointmentProps,
        version: 5,
      });

      expect(appointment.version).toBe(5);
    });

    it('should preserve provided reminderSent', () => {
      const appointment = Appointment.create({
        ...validAppointmentProps,
        reminderSent: true,
      });

      expect(appointment.reminderSent).toBe(true);
    });
  });

  describe('endDateTime', () => {
    it('should calculate endDateTime based on dateTime and duration', () => {
      const appointment = Appointment.create(validAppointmentProps);

      expect(appointment.endDateTime).toEqual(
        new Date('2024-01-16T11:00:00.000Z')
      );
    });

    it('should calculate endDateTime for different durations', () => {
      const appointment = Appointment.create({
        ...validAppointmentProps,
        activityDurationMinutes: 30,
      });

      expect(appointment.endDateTime).toEqual(
        new Date('2024-01-16T10:30:00.000Z')
      );
    });
  });

  describe('withId', () => {
    it('should return a new Appointment with the provided id', () => {
      const appointment = Appointment.create(validAppointmentProps);
      const appointmentWithId = appointment.withId('new-id');

      expect(appointmentWithId.id).toBe('new-id');
      expect(appointmentWithId.activityId).toBe(appointment.activityId);
      expect(appointmentWithId).not.toBe(appointment);
    });
  });

  describe('confirm', () => {
    it('should confirm a pending appointment', () => {
      const appointment = Appointment.create(validAppointmentProps);
      const confirmed = appointment.confirm();

      expect(confirmed.status.isConfirmed()).toBe(true);
      expect(confirmed.version).toBe(appointment.version + 1);
    });

    it('should throw error when confirming a cancelled appointment', () => {
      const appointment = Appointment.create({
        ...validAppointmentProps,
        status: AppointmentStatus.cancelled(),
      });

      expect(() => appointment.confirm()).toThrow(
        'Ce rendez-vous ne peut pas être confirmé'
      );
    });

    it('should throw error when confirming an already confirmed appointment', () => {
      const appointment = Appointment.create({
        ...validAppointmentProps,
        status: AppointmentStatus.confirmed(),
      });

      expect(() => appointment.confirm()).toThrow(
        'Ce rendez-vous ne peut pas être confirmé'
      );
    });
  });

  describe('cancel', () => {
    it('should cancel a pending appointment', () => {
      const appointment = Appointment.create(validAppointmentProps);
      const cancelled = appointment.cancel();

      expect(cancelled.status.isCancelled()).toBe(true);
      expect(cancelled.version).toBe(appointment.version + 1);
    });

    it('should cancel a confirmed appointment', () => {
      const appointment = Appointment.create({
        ...validAppointmentProps,
        status: AppointmentStatus.confirmed(),
      });
      const cancelled = appointment.cancel();

      expect(cancelled.status.isCancelled()).toBe(true);
    });

    it('should throw error when cancelling an already cancelled appointment', () => {
      const appointment = Appointment.create({
        ...validAppointmentProps,
        status: AppointmentStatus.cancelled(),
      });

      expect(() => appointment.cancel()).toThrow(
        'Ce rendez-vous ne peut pas être annulé'
      );
    });
  });

  describe('markReminderSent', () => {
    it('should mark reminder as sent', () => {
      const appointment = Appointment.create(validAppointmentProps);
      const withReminder = appointment.markReminderSent();

      expect(withReminder.reminderSent).toBe(true);
      expect(withReminder.version).toBe(appointment.version);
    });
  });

  describe('overlaps', () => {
    it('should detect overlapping appointments', () => {
      const appointment1 = Appointment.create(validAppointmentProps);
      const appointment2 = Appointment.create({
        ...validAppointmentProps,
        dateTime: new Date('2024-01-16T10:30:00.000Z'),
      });

      expect(appointment1.overlaps(appointment2)).toBe(true);
      expect(appointment2.overlaps(appointment1)).toBe(true);
    });

    it('should not detect overlap for adjacent appointments', () => {
      const appointment1 = Appointment.create(validAppointmentProps);
      const appointment2 = Appointment.create({
        ...validAppointmentProps,
        dateTime: new Date('2024-01-16T11:00:00.000Z'),
      });

      expect(appointment1.overlaps(appointment2)).toBe(false);
      expect(appointment2.overlaps(appointment1)).toBe(false);
    });

    it('should not detect overlap for non-overlapping appointments', () => {
      const appointment1 = Appointment.create(validAppointmentProps);
      const appointment2 = Appointment.create({
        ...validAppointmentProps,
        dateTime: new Date('2024-01-16T12:00:00.000Z'),
      });

      expect(appointment1.overlaps(appointment2)).toBe(false);
    });

    it('should detect overlap when one appointment contains another', () => {
      const appointment1 = Appointment.create({
        ...validAppointmentProps,
        activityDurationMinutes: 120,
      });
      const appointment2 = Appointment.create({
        ...validAppointmentProps,
        dateTime: new Date('2024-01-16T10:30:00.000Z'),
        activityDurationMinutes: 30,
      });

      expect(appointment1.overlaps(appointment2)).toBe(true);
    });
  });

  describe('toObject', () => {
    it('should return a plain object representation', () => {
      const appointment = Appointment.create({
        ...validAppointmentProps,
        id: 'appointment-123',
      });

      const obj = appointment.toObject();

      expect(obj.id).toBe('appointment-123');
      expect(obj.activityId).toBe('activity-123');
      expect(obj.activityName).toBe('Consultation');
      expect(obj.activityDurationMinutes).toBe(60);
      expect(obj.clientInfo).toBe(validClientInfo);
      expect(obj.dateTime).toEqual(new Date('2024-01-16T10:00:00.000Z'));
      expect(obj.status.isPending()).toBe(true);
      expect(obj.version).toBe(1);
      expect(obj.reminderSent).toBe(false);
    });
  });
});
