import { injectable, inject } from 'tsyringe';
import type { IOrderRepository } from '@/domain/order/repositories/IOrderRepository';
import type { Order } from '@/domain/order/entities/Order';

export interface IGetAllOrders {
  execute(): Promise<Order[]>;
}

@injectable()
export class GetAllOrders implements IGetAllOrders {
  constructor(
    @inject('IOrderRepository') private orderRepository: IOrderRepository
  ) {}

  async execute(): Promise<Order[]> {
    return this.orderRepository.getAll();
  }
}
