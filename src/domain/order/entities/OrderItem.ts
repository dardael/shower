export interface OrderItemData {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export class OrderItem {
  private readonly data: OrderItemData;

  private constructor(data: OrderItemData) {
    this.data = data;
  }

  static create(input: OrderItemData): OrderItem {
    OrderItem.validate(input);

    return new OrderItem({
      productId: input.productId,
      productName: input.productName.trim(),
      quantity: input.quantity,
      unitPrice: input.unitPrice,
    });
  }

  static fromData(data: OrderItemData): OrderItem {
    return new OrderItem(data);
  }

  private static validate(input: OrderItemData): void {
    if (!input.productId || input.productId.trim() === '') {
      throw new Error("L'identifiant du produit est requis");
    }

    if (!input.productName || input.productName.trim() === '') {
      throw new Error('Le nom du produit est requis');
    }

    if (input.quantity < 1 || input.quantity > 99) {
      throw new Error('La quantité doit être comprise entre 1 et 99');
    }

    if (input.unitPrice < 0) {
      throw new Error('Le prix unitaire doit être positif');
    }
  }

  get productId(): string {
    return this.data.productId;
  }

  get productName(): string {
    return this.data.productName;
  }

  get quantity(): number {
    return this.data.quantity;
  }

  get unitPrice(): number {
    return this.data.unitPrice;
  }

  getSubtotal(): number {
    return this.data.quantity * this.data.unitPrice;
  }

  toData(): OrderItemData {
    return { ...this.data };
  }
}
