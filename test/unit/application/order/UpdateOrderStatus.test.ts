import { UpdateOrderStatus } from '@/application/order/UpdateOrderStatus';
import { Order } from '@/domain/order/entities/Order';
import { OrderStatus } from '@/domain/order/value-objects/OrderStatus';
import type { IOrderRepository } from '@/domain/order/repositories/IOrderRepository';

describe('UpdateOrderStatus Use Case', () => {
  let mockRepository: jest.Mocked<IOrderRepository>;
  let updateOrderStatus: UpdateOrderStatus;

  const createMockOrder = (status: OrderStatus): Order => {
    return Order.fromData({
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
          unitPrice: 25.0,
        },
      ],
      totalPrice: 50.0,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      updateStatus: jest.fn(),
    };
    updateOrderStatus = new UpdateOrderStatus(mockRepository);
  });

  describe('Successful Status Update', () => {
    it('should update status from NEW to CONFIRMED', async () => {
      const existingOrder = createMockOrder(OrderStatus.NEW);
      const updatedOrder = createMockOrder(OrderStatus.CONFIRMED);

      mockRepository.getById.mockResolvedValue(existingOrder);
      mockRepository.updateStatus.mockResolvedValue(updatedOrder);

      const result = await updateOrderStatus.execute(
        'order-123',
        OrderStatus.CONFIRMED
      );

      expect(result.status).toBe(OrderStatus.CONFIRMED);
      expect(mockRepository.updateStatus).toHaveBeenCalledWith(
        'order-123',
        OrderStatus.CONFIRMED
      );
    });

    it('should update status from CONFIRMED to COMPLETED', async () => {
      const existingOrder = createMockOrder(OrderStatus.CONFIRMED);
      const updatedOrder = createMockOrder(OrderStatus.COMPLETED);

      mockRepository.getById.mockResolvedValue(existingOrder);
      mockRepository.updateStatus.mockResolvedValue(updatedOrder);

      const result = await updateOrderStatus.execute(
        'order-123',
        OrderStatus.COMPLETED
      );

      expect(result.status).toBe(OrderStatus.COMPLETED);
    });

    it('should update status from NEW directly to COMPLETED', async () => {
      const existingOrder = createMockOrder(OrderStatus.NEW);
      const updatedOrder = createMockOrder(OrderStatus.COMPLETED);

      mockRepository.getById.mockResolvedValue(existingOrder);
      mockRepository.updateStatus.mockResolvedValue(updatedOrder);

      const result = await updateOrderStatus.execute(
        'order-123',
        OrderStatus.COMPLETED
      );

      expect(result.status).toBe(OrderStatus.COMPLETED);
    });
  });

  describe('Status Transition Errors', () => {
    it('should throw error for invalid transition from COMPLETED to NEW', async () => {
      const existingOrder = createMockOrder(OrderStatus.COMPLETED);
      mockRepository.getById.mockResolvedValue(existingOrder);

      await expect(
        updateOrderStatus.execute('order-123', OrderStatus.NEW)
      ).rejects.toThrow('Transition de statut invalide');
    });

    it('should throw error for invalid transition from COMPLETED to CONFIRMED', async () => {
      const existingOrder = createMockOrder(OrderStatus.COMPLETED);
      mockRepository.getById.mockResolvedValue(existingOrder);

      await expect(
        updateOrderStatus.execute('order-123', OrderStatus.CONFIRMED)
      ).rejects.toThrow('Transition de statut invalide');
    });

    it('should throw error for invalid transition from CONFIRMED to NEW', async () => {
      const existingOrder = createMockOrder(OrderStatus.CONFIRMED);
      mockRepository.getById.mockResolvedValue(existingOrder);

      await expect(
        updateOrderStatus.execute('order-123', OrderStatus.NEW)
      ).rejects.toThrow('Transition de statut invalide');
    });

    it('should throw error for non-existent order', async () => {
      mockRepository.getById.mockResolvedValue(null);

      await expect(
        updateOrderStatus.execute('non-existent', OrderStatus.CONFIRMED)
      ).rejects.toThrow('Commande non trouvée');
    });
  });

  describe('Same Status Update', () => {
    it('should throw error when updating to same status', async () => {
      const existingOrder = createMockOrder(OrderStatus.NEW);
      mockRepository.getById.mockResolvedValue(existingOrder);

      await expect(
        updateOrderStatus.execute('order-123', OrderStatus.NEW)
      ).rejects.toThrow('Transition de statut invalide');
    });
  });
});
