import { WeeklySlot } from '@/domain/appointment/value-objects/WeeklySlot';

describe('WeeklySlot', () => {
  describe('create', () => {
    it('should create valid weekly slot', () => {
      const slot = WeeklySlot.create({
        dayOfWeek: 1, // Monday
        startTime: '09:00',
        endTime: '17:00',
      });

      expect(slot.dayOfWeek).toBe(1);
      expect(slot.startTime).toBe('09:00');
      expect(slot.endTime).toBe('17:00');
    });

    it('should throw error for invalid day of week (< 0)', () => {
      expect(() =>
        WeeklySlot.create({
          dayOfWeek: -1,
          startTime: '09:00',
          endTime: '17:00',
        })
      ).toThrow(
        'Le jour de la semaine doit être entre 0 (dimanche) et 6 (samedi)'
      );
    });

    it('should throw error for invalid day of week (> 6)', () => {
      expect(() =>
        WeeklySlot.create({
          dayOfWeek: 7,
          startTime: '09:00',
          endTime: '17:00',
        })
      ).toThrow(
        'Le jour de la semaine doit être entre 0 (dimanche) et 6 (samedi)'
      );
    });

    it('should throw error for invalid start time format', () => {
      expect(() =>
        WeeklySlot.create({
          dayOfWeek: 1,
          startTime: '9:00', // Invalid format
          endTime: '17:00',
        })
      ).toThrow("Format d'heure invalide (attendu HH:mm)");
    });

    it('should throw error for invalid end time format', () => {
      expect(() =>
        WeeklySlot.create({
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '5pm', // Invalid format
        })
      ).toThrow("Format d'heure invalide (attendu HH:mm)");
    });

    it('should throw error when end time is before start time', () => {
      expect(() =>
        WeeklySlot.create({
          dayOfWeek: 1,
          startTime: '17:00',
          endTime: '09:00',
        })
      ).toThrow("L'heure de fin doit être après l'heure de début");
    });

    it('should throw error when start and end time are equal', () => {
      expect(() =>
        WeeklySlot.create({
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '09:00',
        })
      ).toThrow("L'heure de fin doit être après l'heure de début");
    });
  });

  describe('getDurationMinutes', () => {
    it('should calculate duration correctly', () => {
      const slot = WeeklySlot.create({
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00',
      });

      expect(slot.getDurationMinutes()).toBe(480); // 8 hours
    });

    it('should handle half-hour slots', () => {
      const slot = WeeklySlot.create({
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '09:30',
      });

      expect(slot.getDurationMinutes()).toBe(30);
    });
  });

  describe('overlaps', () => {
    it('should detect overlapping slots on same day', () => {
      const slot1 = WeeklySlot.create({
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '12:00',
      });
      const slot2 = WeeklySlot.create({
        dayOfWeek: 1,
        startTime: '11:00',
        endTime: '14:00',
      });

      expect(slot1.overlaps(slot2)).toBe(true);
    });

    it('should not detect overlap on different days', () => {
      const slot1 = WeeklySlot.create({
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '12:00',
      });
      const slot2 = WeeklySlot.create({
        dayOfWeek: 2,
        startTime: '09:00',
        endTime: '12:00',
      });

      expect(slot1.overlaps(slot2)).toBe(false);
    });

    it('should not detect overlap for adjacent slots', () => {
      const slot1 = WeeklySlot.create({
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '12:00',
      });
      const slot2 = WeeklySlot.create({
        dayOfWeek: 1,
        startTime: '12:00',
        endTime: '14:00',
      });

      expect(slot1.overlaps(slot2)).toBe(false);
    });
  });

  describe('getDayName', () => {
    it('should return French day name', () => {
      expect(
        WeeklySlot.create({
          dayOfWeek: 0,
          startTime: '09:00',
          endTime: '17:00',
        }).getDayName()
      ).toBe('Dimanche');
      expect(
        WeeklySlot.create({
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '17:00',
        }).getDayName()
      ).toBe('Lundi');
      expect(
        WeeklySlot.create({
          dayOfWeek: 2,
          startTime: '09:00',
          endTime: '17:00',
        }).getDayName()
      ).toBe('Mardi');
      expect(
        WeeklySlot.create({
          dayOfWeek: 3,
          startTime: '09:00',
          endTime: '17:00',
        }).getDayName()
      ).toBe('Mercredi');
      expect(
        WeeklySlot.create({
          dayOfWeek: 4,
          startTime: '09:00',
          endTime: '17:00',
        }).getDayName()
      ).toBe('Jeudi');
      expect(
        WeeklySlot.create({
          dayOfWeek: 5,
          startTime: '09:00',
          endTime: '17:00',
        }).getDayName()
      ).toBe('Vendredi');
      expect(
        WeeklySlot.create({
          dayOfWeek: 6,
          startTime: '09:00',
          endTime: '17:00',
        }).getDayName()
      ).toBe('Samedi');
    });
  });

  describe('toObject', () => {
    it('should return plain object representation', () => {
      const slot = WeeklySlot.create({
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00',
      });

      expect(slot.toObject()).toEqual({
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00',
      });
    });
  });
});
