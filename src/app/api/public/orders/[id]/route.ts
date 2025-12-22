import { NextRequest, NextResponse } from 'next/server';
import { OrderServiceLocator } from '@/infrastructure/container';

interface OrderItemResponse {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface OrderResponse {
  id: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItemResponse[];
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<OrderResponse | { error: string }>> {
  try {
    const { id } = await params;
    const repository = OrderServiceLocator.getOrderRepository();
    const order = await repository.getById(id);

    if (!order) {
      return NextResponse.json(
        { error: 'Commande introuvable' },
        { status: 404 }
      );
    }

    const response: OrderResponse = {
      id: order.id,
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
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la commande' },
      { status: 500 }
    );
  }
}
