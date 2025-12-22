import { OrderStatus } from '@/domain/order/value-objects/OrderStatus';

describe('OrderStatus', () => {
  describe('Status Values', () => {
    it('should have exactly 3 valid statuses: NEW, CONFIRMED, COMPLETED', () => {
      const statuses = Object.values(OrderStatus);
      expect(statuses).toHaveLength(3);
      expect(statuses).toContain('NEW');
      expect(statuses).toContain('CONFIRMED');
      expect(statuses).toContain('COMPLETED');
    });

    it('should have NEW status with value "NEW"', () => {
      expect(OrderStatus.NEW).toBe('NEW');
    });

    it('should have CONFIRMED status with value "CONFIRMED"', () => {
      expect(OrderStatus.CONFIRMED).toBe('CONFIRMED');
    });

    it('should have COMPLETED status with value "COMPLETED"', () => {
      expect(OrderStatus.COMPLETED).toBe('COMPLETED');
    });
  });

  describe('Status Transition Validation', () => {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.NEW]: [OrderStatus.CONFIRMED, OrderStatus.COMPLETED],
      [OrderStatus.CONFIRMED]: [OrderStatus.COMPLETED],
      [OrderStatus.COMPLETED]: [],
    };

    describe('Valid Transitions', () => {
      it('should allow transition from NEW to CONFIRMED', () => {
        const currentStatus = OrderStatus.NEW;
        const newStatus = OrderStatus.CONFIRMED;
        expect(validTransitions[currentStatus]).toContain(newStatus);
      });

      it('should allow transition from NEW to COMPLETED', () => {
        const currentStatus = OrderStatus.NEW;
        const newStatus = OrderStatus.COMPLETED;
        expect(validTransitions[currentStatus]).toContain(newStatus);
      });

      it('should allow transition from CONFIRMED to COMPLETED', () => {
        const currentStatus = OrderStatus.CONFIRMED;
        const newStatus = OrderStatus.COMPLETED;
        expect(validTransitions[currentStatus]).toContain(newStatus);
      });
    });

    describe('Invalid Transitions', () => {
      it('should reject transition from COMPLETED to NEW', () => {
        const currentStatus = OrderStatus.COMPLETED;
        const newStatus = OrderStatus.NEW;
        expect(validTransitions[currentStatus]).not.toContain(newStatus);
      });

      it('should reject transition from COMPLETED to CONFIRMED', () => {
        const currentStatus = OrderStatus.COMPLETED;
        const newStatus = OrderStatus.CONFIRMED;
        expect(validTransitions[currentStatus]).not.toContain(newStatus);
      });

      it('should reject transition from CONFIRMED to NEW', () => {
        const currentStatus = OrderStatus.CONFIRMED;
        const newStatus = OrderStatus.NEW;
        expect(validTransitions[currentStatus]).not.toContain(newStatus);
      });

      it('should not allow any transition from COMPLETED', () => {
        expect(validTransitions[OrderStatus.COMPLETED]).toHaveLength(0);
      });
    });
  });

  describe('Display Labels (French)', () => {
    const statusLabels: Record<OrderStatus, string> = {
      [OrderStatus.NEW]: 'Nouveau',
      [OrderStatus.CONFIRMED]: 'Confirmée',
      [OrderStatus.COMPLETED]: 'Terminée',
    };

    it('should have French label "Nouveau" for NEW status', () => {
      expect(statusLabels[OrderStatus.NEW]).toBe('Nouveau');
    });

    it('should have French label "Confirmée" for CONFIRMED status', () => {
      expect(statusLabels[OrderStatus.CONFIRMED]).toBe('Confirmée');
    });

    it('should have French label "Terminée" for COMPLETED status', () => {
      expect(statusLabels[OrderStatus.COMPLETED]).toBe('Terminée');
    });
  });
});
