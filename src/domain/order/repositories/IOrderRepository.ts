import { Order } from '../entities/Order';
import { OrderStatus } from '../value-objects/OrderStatus';

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  getById(id: string): Promise<Order | null>;
  getAll(): Promise<Order[]>;
  updateStatus(id: string, status: OrderStatus): Promise<Order | null>;
}
