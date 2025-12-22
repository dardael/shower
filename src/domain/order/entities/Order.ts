import { OrderItem, OrderItemData } from './OrderItem';
import { OrderStatus } from '../value-objects/OrderStatus';

export interface OrderData {
  id: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItemData[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderData {
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItemData[];
}

export class Order {
  private readonly data: OrderData;

  private constructor(data: OrderData) {
    this.data = data;
  }

  static create(input: CreateOrderData, id: string): Order {
    Order.validateCustomerInfo(input);
    Order.validateItems(input.items);

    const items = input.items.map((item) => OrderItem.create(item));
    const totalPrice = Order.calculateTotalPrice(items);
    const now = new Date();

    return new Order({
      id,
      customerFirstName: input.customerFirstName.trim(),
      customerLastName: input.customerLastName.trim(),
      customerEmail: input.customerEmail.trim().toLowerCase(),
      customerPhone: Order.normalizePhone(input.customerPhone),
      items: items.map((item) => item.toData()),
      totalPrice,
      status: OrderStatus.NEW,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromData(data: OrderData): Order {
    Order.validateCustomerInfo({
      customerFirstName: data.customerFirstName,
      customerLastName: data.customerLastName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      items: data.items,
    });
    Order.validateItems(data.items);
    // Validate each item
    data.items.forEach((item) => OrderItem.create(item));

    return new Order({
      ...data,
      customerFirstName: data.customerFirstName.trim(),
      customerLastName: data.customerLastName.trim(),
      customerEmail: data.customerEmail.trim().toLowerCase(),
      customerPhone: data.customerPhone.trim(),
    });
  }

  private static validateCustomerInfo(input: CreateOrderData): void {
    if (!input.customerFirstName || input.customerFirstName.trim() === '') {
      throw new Error('Le prénom est requis');
    }

    if (!input.customerLastName || input.customerLastName.trim() === '') {
      throw new Error('Le nom est requis');
    }

    if (!input.customerEmail || input.customerEmail.trim() === '') {
      throw new Error("L'email est requis");
    }

    if (!Order.isValidEmail(input.customerEmail)) {
      throw new Error("Format d'email invalide");
    }

    if (!input.customerPhone || input.customerPhone.trim() === '') {
      throw new Error('Le numéro de téléphone est requis');
    }

    if (!Order.isValidPhone(input.customerPhone)) {
      throw new Error('Format de numéro de téléphone invalide');
    }
  }

  private static validateItems(items: OrderItemData[]): void {
    if (!items || items.length === 0) {
      throw new Error('La commande doit contenir au moins un article');
    }
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  private static isValidPhone(phone: string): boolean {
    const normalized = phone.replace(/[\s\-\.]/g, '');
    // French format: 10 digits starting with 0, or international +33
    const frenchRegex = /^0[1-9][0-9]{8}$/;
    const internationalRegex = /^\+33[1-9][0-9]{8}$/;
    return frenchRegex.test(normalized) || internationalRegex.test(normalized);
  }

  private static normalizePhone(phone: string): string {
    return phone.trim();
  }

  private static calculateTotalPrice(items: OrderItem[]): number {
    return items.reduce((total, item) => total + item.getSubtotal(), 0);
  }

  calculateTotal(): number {
    return this.data.items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0
    );
  }

  updateStatus(newStatus: OrderStatus): Order {
    return new Order({
      ...this.data,
      status: newStatus,
      updatedAt: new Date(),
    });
  }

  get id(): string {
    return this.data.id;
  }

  get customerFirstName(): string {
    return this.data.customerFirstName;
  }

  get customerLastName(): string {
    return this.data.customerLastName;
  }

  get customerEmail(): string {
    return this.data.customerEmail;
  }

  get customerPhone(): string {
    return this.data.customerPhone;
  }

  get items(): OrderItemData[] {
    return [...this.data.items];
  }

  get totalPrice(): number {
    return this.data.totalPrice;
  }

  get status(): OrderStatus {
    return this.data.status;
  }

  get createdAt(): Date {
    return this.data.createdAt;
  }

  get updatedAt(): Date {
    return this.data.updatedAt;
  }

  toData(): OrderData {
    return { ...this.data };
  }
}
