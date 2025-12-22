import { injectable, inject } from 'tsyringe';
import type { IOrderRepository } from '@/domain/order/repositories/IOrderRepository';
import { Order } from '@/domain/order/entities/Order';
import { OrderStatus } from '@/domain/order/value-objects/OrderStatus';

export interface IUpdateOrderStatus {
  execute(orderId: string, newStatus: OrderStatus): Promise<Order>;
}

@injectable()
export class UpdateOrderStatus implements IUpdateOrderStatus {
  constructor(
    @inject('IOrderRepository') private orderRepository: IOrderRepository
  ) {}

  async execute(orderId: string, newStatus: OrderStatus): Promise<Order> {
    const existingOrder = await this.orderRepository.getById(orderId);

    if (!existingOrder) {
      throw new Error('Commande non trouvée');
    }

    // Validate status transition
    this.validateStatusTransition(existingOrder.status, newStatus);

    const updatedOrder = await this.orderRepository.updateStatus(
      orderId,
      newStatus
    );

    if (!updatedOrder) {
      throw new Error('Erreur lors de la mise à jour du statut');
    }

    return updatedOrder;
  }

  private validateStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus
  ): void {
    // Define valid transitions
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.NEW]: [OrderStatus.CONFIRMED, OrderStatus.COMPLETED],
      [OrderStatus.CONFIRMED]: [OrderStatus.COMPLETED],
      [OrderStatus.COMPLETED]: [],
    };

    const allowedNextStatuses = validTransitions[currentStatus];

    if (!allowedNextStatuses.includes(newStatus)) {
      throw new Error(
        `Transition de statut invalide: ${this.getStatusLabel(currentStatus)} → ${this.getStatusLabel(newStatus)}`
      );
    }
  }

  private getStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
      [OrderStatus.NEW]: 'Nouveau',
      [OrderStatus.CONFIRMED]: 'Confirmée',
      [OrderStatus.COMPLETED]: 'Terminée',
    };
    return labels[status];
  }
}
