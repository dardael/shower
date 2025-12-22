import { injectable, inject } from 'tsyringe';
import type { IOrderRepository } from '@/domain/order/repositories/IOrderRepository';
import { Order, CreateOrderData } from '@/domain/order/entities/Order';

export interface CreateOrderInput {
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

@injectable()
export class CreateOrder {
  constructor(
    @inject('IOrderRepository') private orderRepository: IOrderRepository
  ) {}

  async execute(input: CreateOrderInput): Promise<Order> {
    const id = this.generateOrderId();

    const createOrderData: CreateOrderData = {
      customerFirstName: input.customerFirstName,
      customerLastName: input.customerLastName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      items: input.items,
    };

    const order = Order.create(createOrderData, id);

    return this.orderRepository.create(order);
  }

  private generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `order-${timestamp}-${randomPart}`;
  }
}
