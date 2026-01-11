import { AppointmentStatus } from '@/domain/appointment/value-objects/AppointmentStatus';

describe('AppointmentStatus', () => {
  describe('create', () => {
    it('should create a pending status', () => {
      const status = AppointmentStatus.pending();
      expect(status.value).toBe('pending');
      expect(status.isPending()).toBe(true);
      expect(status.isConfirmed()).toBe(false);
      expect(status.isCancelled()).toBe(false);
    });

    it('should create a confirmed status', () => {
      const status = AppointmentStatus.confirmed();
      expect(status.value).toBe('confirmed');
      expect(status.isPending()).toBe(false);
      expect(status.isConfirmed()).toBe(true);
      expect(status.isCancelled()).toBe(false);
    });

    it('should create a cancelled status', () => {
      const status = AppointmentStatus.cancelled();
      expect(status.value).toBe('cancelled');
      expect(status.isPending()).toBe(false);
      expect(status.isConfirmed()).toBe(false);
      expect(status.isCancelled()).toBe(true);
    });

    it('should create from valid string value', () => {
      const status = AppointmentStatus.fromString('confirmed');
      expect(status.isConfirmed()).toBe(true);
    });

    it('should throw error for invalid string value', () => {
      expect(() => AppointmentStatus.fromString('invalid')).toThrow(
        'Statut de rendez-vous invalide : invalid'
      );
    });
  });

  describe('transitions', () => {
    it('should allow transition from pending to confirmed', () => {
      const status = AppointmentStatus.pending();
      expect(status.canTransitionTo(AppointmentStatus.confirmed())).toBe(true);
    });

    it('should allow transition from pending to cancelled', () => {
      const status = AppointmentStatus.pending();
      expect(status.canTransitionTo(AppointmentStatus.cancelled())).toBe(true);
    });

    it('should allow transition from confirmed to cancelled', () => {
      const status = AppointmentStatus.confirmed();
      expect(status.canTransitionTo(AppointmentStatus.cancelled())).toBe(true);
    });

    it('should not allow transition from cancelled to any other status', () => {
      const status = AppointmentStatus.cancelled();
      expect(status.canTransitionTo(AppointmentStatus.pending())).toBe(false);
      expect(status.canTransitionTo(AppointmentStatus.confirmed())).toBe(false);
    });
  });

  describe('equality', () => {
    it('should be equal when values match', () => {
      const status1 = AppointmentStatus.pending();
      const status2 = AppointmentStatus.pending();
      expect(status1.equals(status2)).toBe(true);
    });

    it('should not be equal when values differ', () => {
      const status1 = AppointmentStatus.pending();
      const status2 = AppointmentStatus.confirmed();
      expect(status1.equals(status2)).toBe(false);
    });
  });
});
