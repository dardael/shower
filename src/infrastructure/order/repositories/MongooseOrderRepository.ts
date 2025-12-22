import { injectable } from 'tsyringe';
import type { IOrderRepository } from '@/domain/order/repositories/IOrderRepository';
import { Order } from '@/domain/order/entities/Order';
import { OrderStatus } from '@/domain/order/value-objects/OrderStatus';
import {
  OrderModel,
  IOrderDocument,
  IOrderItemDocument,
} from '@/infrastructure/order/models/OrderModel';

@injectable()
export class MongooseOrderRepository implements IOrderRepository {
  async create(order: Order): Promise<Order> {
    const document = await OrderModel.create(this.mapToDatabase(order));
    return this.mapToDomain(document);
  }

  async getById(id: string): Promise<Order | null> {
    const document = await OrderModel.findById(id).exec();
    return document ? this.mapToDomain(document) : null;
  }

  async getAll(): Promise<Order[]> {
    const documents = await OrderModel.find().sort({ createdAt: -1 }).exec();
    return documents.map((doc) => this.mapToDomain(doc));
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const document = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).exec();
    return document ? this.mapToDomain(document) : null;
  }

  private mapToDomain(document: IOrderDocument): Order {
    const items = document.items.map((item: IOrderItemDocument) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));

    return Order.fromData({
      id: document._id,
      customerFirstName: document.customerFirstName,
      customerLastName: document.customerLastName,
      customerEmail: document.customerEmail,
      customerPhone: document.customerPhone,
      items,
      totalPrice: document.totalPrice,
      status: document.status as OrderStatus,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  private mapToDatabase(order: Order): {
    _id: string;
    customerFirstName: string;
    customerLastName: string;
    customerEmail: string;
    customerPhone: string;
    items: IOrderItemDocument[];
    totalPrice: number;
    status: 'NEW' | 'CONFIRMED' | 'COMPLETED';
  } {
    return {
      _id: order.id,
      customerFirstName: order.customerFirstName,
      customerLastName: order.customerLastName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      items: order.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      totalPrice: order.totalPrice,
      status: order.status,
    };
  }
}
