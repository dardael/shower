import { injectable, inject } from 'tsyringe';
import type { IOrderRepository } from '@/domain/order/repositories/IOrderRepository';
import type { Order } from '@/domain/order/entities/Order';

export interface IGetOrderById {
  execute(id: string): Promise<Order | null>;
}

@injectable()
export class GetOrderById implements IGetOrderById {
  constructor(
    @inject('IOrderRepository') private orderRepository: IOrderRepository
  ) {}

  async execute(id: string): Promise<Order | null> {
    if (!id || id.trim() === '') {
      throw new Error("L'identifiant de la commande est requis");
    }
    return this.orderRepository.getById(id);
  }
}
