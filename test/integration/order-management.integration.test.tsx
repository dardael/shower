/**
 * Integration tests for Order Management feature
 * Tests the complete checkout flow and admin order management
 */

import { Order } from '@/domain/order/entities/Order';
import {
  OrderStatus,
  getValidTransitions,
  getOrderStatusLabel,
} from '@/domain/order/value-objects/OrderStatus';

describe('Order Management Integration', () => {
  describe('Order Creation Flow', () => {
    const validOrderInput = {
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
      ],
    };

    it('should create order with valid customer information', () => {
      const order = Order.create(validOrderInput, 'order-123');

      expect(order.id).toBe('order-123');
      expect(order.customerFirstName).toBe('Jean');
      expect(order.customerLastName).toBe('Dupont');
      expect(order.customerEmail).toBe('jean.dupont@example.com');
      expect(order.status).toBe(OrderStatus.NEW);
    });

    it('should calculate correct total price from items', () => {
      const order = Order.create(validOrderInput, 'order-123');

      expect(order.totalPrice).toBe(59.98); // 2 * 29.99
    });

    it('should reject order with invalid email format', () => {
      expect(() =>
        Order.create(
          { ...validOrderInput, customerEmail: 'invalid-email' },
          'order-123'
        )
      ).toThrow("Format d'email invalide");
    });

    it('should reject order with invalid phone format', () => {
      expect(() =>
        Order.create({ ...validOrderInput, customerPhone: '123' }, 'order-123')
      ).toThrow('Format de numéro de téléphone invalide');
    });

    it('should reject order with empty cart', () => {
      expect(() =>
        Order.create(
          {
            customerFirstName: 'Jean',
            customerLastName: 'Dupont',
            customerEmail: 'jean@example.com',
            customerPhone: '0612345678',
            items: [],
          },
          'order-123'
        )
      ).toThrow('La commande doit contenir au moins un article');
    });

    it('should trim whitespace from customer information', () => {
      const order = Order.create(
        {
          ...validOrderInput,
          customerFirstName: '  Jean  ',
          customerLastName: '  Dupont  ',
          customerEmail: '  JEAN@EXAMPLE.COM  ',
        },
        'order-123'
      );

      expect(order.customerFirstName).toBe('Jean');
      expect(order.customerLastName).toBe('Dupont');
      expect(order.customerEmail).toBe('jean@example.com');
    });
  });

  describe('Order Status Transitions', () => {
    it('should allow transition from NEW to CONFIRMED', () => {
      const validTransitions = getValidTransitions(OrderStatus.NEW);
      expect(validTransitions).toContain(OrderStatus.CONFIRMED);
    });

    it('should allow transition from CONFIRMED to COMPLETED', () => {
      const validTransitions = getValidTransitions(OrderStatus.CONFIRMED);
      expect(validTransitions).toContain(OrderStatus.COMPLETED);
    });

    it('should allow direct transition from NEW to COMPLETED', () => {
      const validTransitions = getValidTransitions(OrderStatus.NEW);
      expect(validTransitions).toContain(OrderStatus.COMPLETED);
    });

    it('should not allow transition from COMPLETED to any other status', () => {
      const validTransitions = getValidTransitions(OrderStatus.COMPLETED);
      expect(validTransitions).toHaveLength(0);
    });

    it('should not allow transition from CONFIRMED back to NEW', () => {
      const validTransitions = getValidTransitions(OrderStatus.CONFIRMED);
      expect(validTransitions).not.toContain(OrderStatus.NEW);
    });
  });

  describe('Order Item Validation', () => {
    const baseInput = {
      customerFirstName: 'Jean',
      customerLastName: 'Dupont',
      customerEmail: 'jean@example.com',
      customerPhone: '0612345678',
    };

    it('should reject item with quantity less than 1', () => {
      expect(() =>
        Order.create(
          {
            ...baseInput,
            items: [
              {
                productId: 'prod-1',
                productName: 'Test',
                quantity: 0,
                unitPrice: 10,
              },
            ],
          },
          'order-123'
        )
      ).toThrow('La quantité doit être comprise entre 1 et 99');
    });

    it('should reject item with quantity greater than 99', () => {
      expect(() =>
        Order.create(
          {
            ...baseInput,
            items: [
              {
                productId: 'prod-1',
                productName: 'Test',
                quantity: 100,
                unitPrice: 10,
              },
            ],
          },
          'order-123'
        )
      ).toThrow('La quantité doit être comprise entre 1 et 99');
    });

    it('should reject item with negative price', () => {
      expect(() =>
        Order.create(
          {
            ...baseInput,
            items: [
              {
                productId: 'prod-1',
                productName: 'Test',
                quantity: 1,
                unitPrice: -10,
              },
            ],
          },
          'order-123'
        )
      ).toThrow('Le prix unitaire doit être positif');
    });

    it('should calculate total for multiple items correctly', () => {
      const order = Order.create(
        {
          ...baseInput,
          items: [
            {
              productId: 'prod-1',
              productName: 'Produit A',
              quantity: 2,
              unitPrice: 10,
            },
            {
              productId: 'prod-2',
              productName: 'Produit B',
              quantity: 3,
              unitPrice: 15,
            },
          ],
        },
        'order-123'
      );

      expect(order.totalPrice).toBe(65); // (2*10) + (3*15) = 20 + 45 = 65
    });
  });

  describe('French Labels Validation', () => {
    it('should return French label for NEW status', () => {
      expect(getOrderStatusLabel(OrderStatus.NEW)).toBe('Nouveau');
    });

    it('should return French label for CONFIRMED status', () => {
      expect(getOrderStatusLabel(OrderStatus.CONFIRMED)).toBe('Confirmée');
    });

    it('should return French label for COMPLETED status', () => {
      expect(getOrderStatusLabel(OrderStatus.COMPLETED)).toBe('Terminée');
    });
  });
});
