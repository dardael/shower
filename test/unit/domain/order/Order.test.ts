import { Order } from '@/domain/order/entities/Order';
import { OrderStatus } from '@/domain/order/value-objects/OrderStatus';

describe('Order Entity', () => {
  const validOrderData = {
    id: 'order-123',
    customerFirstName: 'Jean',
    customerLastName: 'Dupont',
    customerEmail: 'jean.dupont@example.com',
    customerPhone: '0612345678',
    items: [
      {
        productId: 'prod-1',
        productName: 'Produit Test',
        quantity: 2,
        unitPrice: 10.5,
      },
    ],
    totalPrice: 21.0,
    status: OrderStatus.NEW,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('Purchaser Information Validation', () => {
    it('should create order with valid purchaser info (nom, prénom, email, téléphone)', () => {
      const order = Order.fromData(validOrderData);

      expect(order.customerFirstName).toBe('Jean');
      expect(order.customerLastName).toBe('Dupont');
      expect(order.customerEmail).toBe('jean.dupont@example.com');
      expect(order.customerPhone).toBe('0612345678');
    });

    it('should reject empty firstName (prénom)', () => {
      expect(() =>
        Order.fromData({ ...validOrderData, customerFirstName: '' })
      ).toThrow('Le prénom est requis');
    });

    it('should reject empty lastName (nom)', () => {
      expect(() =>
        Order.fromData({ ...validOrderData, customerLastName: '' })
      ).toThrow('Le nom est requis');
    });

    it('should reject empty email', () => {
      expect(() =>
        Order.fromData({ ...validOrderData, customerEmail: '' })
      ).toThrow("L'email est requis");
    });

    it('should reject invalid email format (missing @)', () => {
      expect(() =>
        Order.fromData({ ...validOrderData, customerEmail: 'invalidemail.com' })
      ).toThrow("Format d'email invalide");
    });

    it('should reject invalid email format (missing domain)', () => {
      expect(() =>
        Order.fromData({ ...validOrderData, customerEmail: 'invalid@' })
      ).toThrow("Format d'email invalide");
    });

    it('should reject empty phone number', () => {
      expect(() =>
        Order.fromData({ ...validOrderData, customerPhone: '' })
      ).toThrow('Le numéro de téléphone est requis');
    });

    it('should reject phone number with invalid characters', () => {
      expect(() =>
        Order.fromData({ ...validOrderData, customerPhone: 'abc123def' })
      ).toThrow('Format de numéro de téléphone invalide');
    });

    it('should accept phone number with spaces and dashes', () => {
      const order = Order.fromData({
        ...validOrderData,
        customerPhone: '06 12 34 56 78',
      });
      expect(order.customerPhone).toBe('06 12 34 56 78');

      const order2 = Order.fromData({
        ...validOrderData,
        customerPhone: '06-12-34-56-78',
      });
      expect(order2.customerPhone).toBe('06-12-34-56-78');
    });

    it('should accept international phone format (+33)', () => {
      const order = Order.fromData({
        ...validOrderData,
        customerPhone: '+33612345678',
      });
      expect(order.customerPhone).toBe('+33612345678');
    });

    it('should trim whitespace from all fields', () => {
      const order = Order.fromData({
        ...validOrderData,
        customerFirstName: '  Jean  ',
        customerLastName: '  Dupont  ',
        customerEmail: '  jean.dupont@example.com  ',
        customerPhone: '  0612345678  ',
      });

      expect(order.customerFirstName).toBe('Jean');
      expect(order.customerLastName).toBe('Dupont');
      expect(order.customerEmail).toBe('jean.dupont@example.com');
      expect(order.customerPhone).toBe('0612345678');
    });
  });

  describe('Order Items Validation', () => {
    it('should reject order with empty items array', () => {
      expect(() => Order.fromData({ ...validOrderData, items: [] })).toThrow(
        'La commande doit contenir au moins un article'
      );
    });

    it('should reject order item with quantity < 1', () => {
      expect(() =>
        Order.fromData({
          ...validOrderData,
          items: [{ ...validOrderData.items[0], quantity: 0 }],
        })
      ).toThrow('La quantité doit être comprise entre 1 et 99');
    });

    it('should reject order item with quantity > 99', () => {
      expect(() =>
        Order.fromData({
          ...validOrderData,
          items: [{ ...validOrderData.items[0], quantity: 100 }],
        })
      ).toThrow('La quantité doit être comprise entre 1 et 99');
    });

    it('should reject order item with negative price', () => {
      expect(() =>
        Order.fromData({
          ...validOrderData,
          items: [{ ...validOrderData.items[0], unitPrice: -5 }],
        })
      ).toThrow('Le prix unitaire doit être positif');
    });

    it('should calculate total price correctly from items', () => {
      const order = Order.fromData({
        ...validOrderData,
        items: [
          { productId: 'p1', productName: 'A', quantity: 2, unitPrice: 10 },
          { productId: 'p2', productName: 'B', quantity: 3, unitPrice: 5.5 },
        ],
        totalPrice: 36.5,
      });

      expect(order.calculateTotal()).toBe(36.5);
    });
  });
});
