import { CreateOrder } from '@/application/order/CreateOrder';
import type { IOrderRepository } from '@/domain/order/repositories/IOrderRepository';
import { Order } from '@/domain/order/entities/Order';
import { OrderStatus } from '@/domain/order/value-objects/OrderStatus';

describe('CreateOrder Use Case', () => {
  let createOrder: CreateOrder;
  let mockOrderRepository: jest.Mocked<IOrderRepository>;

  const validInput = {
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
  };

  beforeEach(() => {
    mockOrderRepository = {
      create: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      updateStatus: jest.fn(),
    };
    createOrder = new CreateOrder(mockOrderRepository);
  });

  describe('Successful Order Creation', () => {
    it('should create order with valid data and return order with id', async () => {
      const createdOrder = Order.fromData({
        id: 'order-123',
        ...validInput,
        totalPrice: 21.0,
        status: OrderStatus.NEW,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockOrderRepository.create.mockResolvedValue(createdOrder);

      const result = await createOrder.execute(validInput);

      expect(result.id).toBeDefined();
      expect(result.id).toBe('order-123');
      expect(mockOrderRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should set initial status to "nouveau"', async () => {
      const createdOrder = Order.fromData({
        id: 'order-123',
        ...validInput,
        totalPrice: 21.0,
        status: OrderStatus.NEW,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockOrderRepository.create.mockResolvedValue(createdOrder);

      const result = await createOrder.execute(validInput);

      expect(result.status).toBe(OrderStatus.NEW);
    });

    it('should set createdAt to current timestamp', async () => {
      const now = new Date();
      const createdOrder = Order.fromData({
        id: 'order-123',
        ...validInput,
        totalPrice: 21.0,
        status: OrderStatus.NEW,
        createdAt: now,
        updatedAt: now,
      });
      mockOrderRepository.create.mockResolvedValue(createdOrder);

      const result = await createOrder.execute(validInput);

      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should persist order via repository', async () => {
      const createdOrder = Order.fromData({
        id: 'order-123',
        ...validInput,
        totalPrice: 21.0,
        status: OrderStatus.NEW,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockOrderRepository.create.mockResolvedValue(createdOrder);

      await createOrder.execute(validInput);

      expect(mockOrderRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          customerFirstName: 'Jean',
          customerLastName: 'Dupont',
          customerEmail: 'jean.dupont@example.com',
          customerPhone: '0612345678',
        })
      );
    });
  });

  describe('Purchaser Validation Errors', () => {
    it('should throw validation error for missing firstName', async () => {
      await expect(
        createOrder.execute({ ...validInput, customerFirstName: '' })
      ).rejects.toThrow('Le prénom est requis');
    });

    it('should throw validation error for missing lastName', async () => {
      await expect(
        createOrder.execute({ ...validInput, customerLastName: '' })
      ).rejects.toThrow('Le nom est requis');
    });

    it('should throw validation error for invalid email', async () => {
      await expect(
        createOrder.execute({ ...validInput, customerEmail: 'invalid' })
      ).rejects.toThrow("Format d'email invalide");
    });

    it('should throw validation error for invalid phone', async () => {
      await expect(
        createOrder.execute({ ...validInput, customerPhone: 'abc' })
      ).rejects.toThrow('Format de numéro de téléphone invalide');
    });

    it('should include field name in validation error message', async () => {
      await expect(
        createOrder.execute({ ...validInput, customerEmail: '' })
      ).rejects.toThrow(/email/i);
    });
  });

  describe('Items Validation Errors', () => {
    it('should throw validation error for empty cart', async () => {
      await expect(
        createOrder.execute({ ...validInput, items: [] })
      ).rejects.toThrow('La commande doit contenir au moins un article');
    });

    it('should throw validation error for invalid quantity', async () => {
      await expect(
        createOrder.execute({
          ...validInput,
          items: [{ ...validInput.items[0], quantity: 0 }],
        })
      ).rejects.toThrow('La quantité doit être comprise entre 1 et 99');
    });
  });
});
