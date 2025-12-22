import { NextRequest, NextResponse } from 'next/server';
import { OrderStatus } from '@/domain/order/value-objects/OrderStatus';
import { OrderServiceLocator } from '@/infrastructure/container';
import { authenticateRequest } from '@/infrastructure/auth/ApiAuthentication';

interface UpdateStatusRequest {
  status: 'NEW' | 'CONFIRMED' | 'COMPLETED';
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  request: NextRequest,
  context: RouteParams
): Promise<NextResponse> {
  // Authenticate admin
  const authError = await authenticateRequest(request);
  if (authError) {
    return authError;
  }

  try {
    const { id } = await context.params;
    const body = (await request.json()) as UpdateStatusRequest;

    if (!body.status) {
      return NextResponse.json(
        { error: 'Le statut est requis' },
        { status: 400 }
      );
    }

    // Validate status value
    if (!Object.values(OrderStatus).includes(body.status as OrderStatus)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
    }

    const repository = OrderServiceLocator.getOrderRepository();
    const existingOrder = await repository.getById(id);

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Validate status transition
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.NEW]: [OrderStatus.CONFIRMED, OrderStatus.COMPLETED],
      [OrderStatus.CONFIRMED]: [OrderStatus.COMPLETED],
      [OrderStatus.COMPLETED]: [],
    };

    const allowedNextStatuses = validTransitions[existingOrder.status];
    const newStatus = body.status as OrderStatus;

    if (!allowedNextStatuses.includes(newStatus)) {
      return NextResponse.json(
        { error: 'Transition de statut invalide' },
        { status: 400 }
      );
    }

    const updatedOrder = await repository.updateStatus(id, newStatus);

    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: updatedOrder.id,
      status: updatedOrder.status,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du statut' },
      { status: 500 }
    );
  }
}
