import { Activity } from '@/domain/appointment/entities/Activity';
import { RequiredFieldsConfig } from '@/domain/appointment/value-objects/RequiredFieldsConfig';
import { ReminderSettings } from '@/domain/appointment/value-objects/ReminderSettings';

describe('Activity', () => {
  const validRequiredFields = RequiredFieldsConfig.default();
  const validReminderSettings = ReminderSettings.withHours(24);

  const validActivityProps = {
    name: 'Consultation',
    description: 'A consultation session',
    durationMinutes: 60,
    color: '#3498db',
    price: 50,
    requiredFields: validRequiredFields,
    reminderSettings: validReminderSettings,
    minimumBookingNoticeHours: 24,
  };

  describe('create', () => {
    it('should create an Activity with valid props', () => {
      const activity = Activity.create(validActivityProps);

      expect(activity.name).toBe('Consultation');
      expect(activity.description).toBe('A consultation session');
      expect(activity.durationMinutes).toBe(60);
      expect(activity.color).toBe('#3498db');
      expect(activity.price).toBe(50);
      expect(activity.requiredFields.equals(validRequiredFields)).toBe(true);
      expect(activity.reminderSettings.equals(validReminderSettings)).toBe(
        true
      );
      expect(activity.minimumBookingNoticeHours).toBe(24);
      expect(activity.id).toBeUndefined();
      expect(activity.createdAt).toBeInstanceOf(Date);
      expect(activity.updatedAt).toBeInstanceOf(Date);
    });

    it('should trim the name', () => {
      const activity = Activity.create({
        ...validActivityProps,
        name: '  Consultation  ',
      });

      expect(activity.name).toBe('Consultation');
    });

    it('should trim the description', () => {
      const activity = Activity.create({
        ...validActivityProps,
        description: '  Description with spaces  ',
      });

      expect(activity.description).toBe('Description with spaces');
    });

    it('should set description to undefined if empty after trim', () => {
      const activity = Activity.create({
        ...validActivityProps,
        description: '   ',
      });

      expect(activity.description).toBeUndefined();
    });

    it('should lowercase the color', () => {
      const activity = Activity.create({
        ...validActivityProps,
        color: '#3498DB',
      });

      expect(activity.color).toBe('#3498db');
    });

    it('should throw error when name is empty', () => {
      expect(() =>
        Activity.create({
          ...validActivityProps,
          name: '',
        })
      ).toThrow("Le nom de l'activité est requis");
    });

    it('should throw error when name is only whitespace', () => {
      expect(() =>
        Activity.create({
          ...validActivityProps,
          name: '   ',
        })
      ).toThrow("Le nom de l'activité est requis");
    });

    it('should throw error when durationMinutes is 0', () => {
      expect(() =>
        Activity.create({
          ...validActivityProps,
          durationMinutes: 0,
        })
      ).toThrow('La durée doit être supérieure à 0 minutes');
    });

    it('should throw error when durationMinutes is negative', () => {
      expect(() =>
        Activity.create({
          ...validActivityProps,
          durationMinutes: -30,
        })
      ).toThrow('La durée doit être supérieure à 0 minutes');
    });

    it('should throw error when color format is invalid', () => {
      expect(() =>
        Activity.create({
          ...validActivityProps,
          color: 'red',
        })
      ).toThrow('Format de couleur invalide (attendu #RRGGBB ou #RGB)');
    });

    it('should throw error when color is missing hash', () => {
      expect(() =>
        Activity.create({
          ...validActivityProps,
          color: '3498db',
        })
      ).toThrow('Format de couleur invalide (attendu #RRGGBB ou #RGB)');
    });

    it('should accept 3-character hex color', () => {
      const activity = Activity.create({
        ...validActivityProps,
        color: '#FFF',
      });

      expect(activity.color).toBe('#fff');
    });

    it('should throw error when price is negative', () => {
      expect(() =>
        Activity.create({
          ...validActivityProps,
          price: -10,
        })
      ).toThrow('Le prix ne peut pas être négatif');
    });

    it('should accept price of 0', () => {
      const activity = Activity.create({
        ...validActivityProps,
        price: 0,
      });

      expect(activity.price).toBe(0);
    });

    it('should throw error when minimumBookingNoticeHours is negative', () => {
      expect(() =>
        Activity.create({
          ...validActivityProps,
          minimumBookingNoticeHours: -1,
        })
      ).toThrow('Le délai minimum de réservation ne peut pas être négatif');
    });

    it('should accept minimumBookingNoticeHours of 0', () => {
      const activity = Activity.create({
        ...validActivityProps,
        minimumBookingNoticeHours: 0,
      });

      expect(activity.minimumBookingNoticeHours).toBe(0);
    });

    it('should preserve provided id', () => {
      const activity = Activity.create({
        ...validActivityProps,
        id: 'activity-123',
      });

      expect(activity.id).toBe('activity-123');
    });

    it('should preserve provided dates', () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');

      const activity = Activity.create({
        ...validActivityProps,
        createdAt,
        updatedAt,
      });

      expect(activity.createdAt).toEqual(createdAt);
      expect(activity.updatedAt).toEqual(updatedAt);
    });
  });

  describe('withId', () => {
    it('should return a new Activity with the provided id', () => {
      const activity = Activity.create(validActivityProps);
      const activityWithId = activity.withId('new-id');

      expect(activityWithId.id).toBe('new-id');
      expect(activityWithId.name).toBe(activity.name);
      expect(activityWithId).not.toBe(activity);
    });
  });

  describe('update', () => {
    it('should return a new Activity with updated properties', () => {
      const activity = Activity.create({
        ...validActivityProps,
        id: 'activity-123',
      });

      const updatedActivity = activity.update({
        name: 'Updated Name',
        price: 100,
      });

      expect(updatedActivity.name).toBe('Updated Name');
      expect(updatedActivity.price).toBe(100);
      expect(updatedActivity.id).toBe('activity-123');
      expect(updatedActivity.durationMinutes).toBe(60);
      expect(updatedActivity.updatedAt.getTime()).toBeGreaterThanOrEqual(
        activity.updatedAt.getTime()
      );
    });

    it('should preserve original values for unspecified properties', () => {
      const activity = Activity.create(validActivityProps);
      const updatedActivity = activity.update({ name: 'New Name' });

      expect(updatedActivity.description).toBe(activity.description);
      expect(updatedActivity.color).toBe(activity.color);
      expect(updatedActivity.durationMinutes).toBe(activity.durationMinutes);
    });

    it('should trim updated name', () => {
      const activity = Activity.create(validActivityProps);
      const updatedActivity = activity.update({ name: '  Trimmed Name  ' });

      expect(updatedActivity.name).toBe('Trimmed Name');
    });

    it('should allow clearing description', () => {
      const activity = Activity.create(validActivityProps);
      const updatedActivity = activity.update({ description: '' });

      expect(updatedActivity.description).toBeUndefined();
    });
  });

  describe('toObject', () => {
    it('should return a plain object representation', () => {
      const activity = Activity.create({
        ...validActivityProps,
        id: 'activity-123',
      });

      const obj = activity.toObject();

      expect(obj.id).toBe('activity-123');
      expect(obj.name).toBe('Consultation');
      expect(obj.description).toBe('A consultation session');
      expect(obj.durationMinutes).toBe(60);
      expect(obj.color).toBe('#3498db');
      expect(obj.price).toBe(50);
      expect(obj.requiredFields.equals(validRequiredFields)).toBe(true);
      expect(obj.reminderSettings.equals(validReminderSettings)).toBe(true);
      expect(obj.minimumBookingNoticeHours).toBe(24);
    });
  });
});
