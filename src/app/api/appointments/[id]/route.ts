import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import {
  GetAppointmentById,
  ConfirmAppointment,
  CancelAppointment,
  DeleteAppointment,
} from '@/application/appointment/AppointmentUseCases';
import { SendAppointmentAdminConfirmation } from '@/application/appointment/SendAppointmentAdminConfirmation';
import { SendAppointmentCancellationEmail } from '@/application/appointment/SendAppointmentCancellationEmail';
import { withApiParams } from '@/infrastructure/shared/apiWrapper';
import { appointmentToResponse } from '@/presentation/appointment/apiMappers';
import { Logger } from '@/application/shared/Logger';

interface RouteParams {
  id: string;
}

export const GET = withApiParams<RouteParams, NextResponse>(
  async (
    _request: NextRequest,
    { params }: { params: Promise<RouteParams> }
  ): Promise<NextResponse> => {
    const { id } = await params;

    const getAppointmentById = container.resolve(GetAppointmentById);
    const appointment = await getAppointmentById.execute(id);

    if (!appointment) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(appointmentToResponse(appointment));
  },
  { requireAuth: true }
);

export const PATCH = withApiParams<RouteParams, NextResponse>(
  async (
    request: NextRequest,
    { params }: { params: Promise<RouteParams> }
  ): Promise<NextResponse> => {
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    if (action === 'confirm') {
      try {
        const confirmAppointment = container.resolve(ConfirmAppointment);
        const appointment = await confirmAppointment.execute(id);

        // Send admin confirmation email asynchronously
        if (appointment.id) {
          const sendAdminConfirmation = container.resolve(
            SendAppointmentAdminConfirmation
          );
          const logger = new Logger();
          sendAdminConfirmation
            .execute({ appointmentId: appointment.id })
            .catch((error) => {
              logger.logErrorWithObject(
                error,
                "Erreur lors de l'envoi de l'email de confirmation admin"
              );
            });
        }

        return NextResponse.json(appointmentToResponse(appointment));
      } catch (error) {
        if (error instanceof Error) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json(
          { error: 'Impossible de confirmer le rendez-vous' },
          { status: 500 }
        );
      }
    } else if (action === 'cancel') {
      const cancelAppointment = container.resolve(CancelAppointment);
      const appointment = await cancelAppointment.execute(id);

      // Send cancellation email asynchronously
      if (appointment.id) {
        const sendCancellation = container.resolve(
          SendAppointmentCancellationEmail
        );
        const logger = new Logger();
        sendCancellation
          .execute({ appointmentId: appointment.id })
          .catch((error) => {
            logger.logErrorWithObject(
              error,
              "Erreur lors de l'envoi de l'email d'annulation"
            );
          });
      }

      return NextResponse.json(appointmentToResponse(appointment));
    }

    return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
  },
  { requireAuth: true }
);

export const DELETE = withApiParams<RouteParams, NextResponse>(
  async (
    _request: NextRequest,
    { params }: { params: Promise<RouteParams> }
  ): Promise<NextResponse> => {
    const { id } = await params;

    const deleteAppointment = container.resolve(DeleteAppointment);
    await deleteAppointment.execute(id);

    return new NextResponse(null, { status: 204 });
  },
  { requireAuth: true }
);
