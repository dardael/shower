import { NextResponse } from 'next/server';
import { OrderServiceLocator } from '@/infrastructure/container';
import { authenticateRequest } from '@/infrastructure/auth/ApiAuthentication';
import type { NextRequest } from 'next/server';

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
  request: NextRequest
): Promise<NextResponse<OrderResponse[] | { error: string }>> {
  // Check authentication
  const authError = await authenticateRequest(request);
  if (authError) {
    return authError;
  }

  try {
    const repository = OrderServiceLocator.getOrderRepository();
    const orders = await repository.getAll();

    const response: OrderResponse[] = orders.map((order) => ({
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
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}
