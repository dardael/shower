import { NextRequest, NextResponse } from 'next/server';
import { Order } from '@/domain/order/entities/Order';
import { OrderServiceLocator } from '@/infrastructure/container';
import crypto from 'crypto';

interface CreateOrderItemRequest {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface CreateOrderRequest {
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  items: CreateOrderItemRequest[];
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<{ id: string } | { error: string }>> {
  try {
    const body = (await request.json()) as CreateOrderRequest;

    // Validate required fields presence
    if (!body.customerFirstName || !body.customerLastName) {
      return NextResponse.json(
        { error: 'Le prénom et le nom sont requis' },
        { status: 400 }
      );
    }

    if (!body.customerEmail) {
      return NextResponse.json(
        { error: "L'adresse email est requise" },
        { status: 400 }
      );
    }

    if (!body.customerPhone) {
      return NextResponse.json(
        { error: 'Le numéro de téléphone est requis' },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Le panier ne peut pas être vide' },
        { status: 400 }
      );
    }

    // Create order using domain entity (handles validation)
    const orderId = crypto.randomUUID();
    const order = Order.create(
      {
        customerFirstName: body.customerFirstName,
        customerLastName: body.customerLastName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        items: body.items,
      },
      orderId
    );

    // Persist order
    const repository = OrderServiceLocator.getOrderRepository();
    const savedOrder = await repository.create(order);

    return NextResponse.json({ id: savedOrder.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      // Domain validation errors
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    );
  }
}
