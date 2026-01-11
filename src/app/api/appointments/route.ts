import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import {
  GetAllAppointments,
  CreateAppointment,
} from '@/application/appointment/AppointmentUseCases';
import { SendAppointmentConfirmation } from '@/application/appointment/SendAppointmentConfirmation';
import { SendAdminNewBookingNotification } from '@/application/appointment/SendAdminNewBookingNotification';
import { withApi } from '@/infrastructure/shared/apiWrapper';
import { appointmentToResponse } from '@/presentation/appointment/apiMappers';
import { Logger } from '@/application/shared/Logger';

export const GET = withApi<NextResponse>(
  async (): Promise<NextResponse> => {
    const getAllAppointments = container.resolve(GetAllAppointments);
    const appointments = await getAllAppointments.execute();

    const response = appointments.map(appointmentToResponse);

    return NextResponse.json(response);
  },
  { requireAuth: true }
);

export const POST = withApi<NextResponse>(
  async (request: NextRequest): Promise<NextResponse> => {
    try {
      const body = await request.json();

      const hasDateTimeFormat = body.dateTime;
      const hasSlotFormat = body.date && body.slot;

      if (
        !body.activityId ||
        (!hasDateTimeFormat && !hasSlotFormat) ||
        !body.clientInfo
      ) {
        return NextResponse.json(
          {
            error:
              'Champs requis manquants: activityId, dateTime ou (date + slot), clientInfo',
          },
          { status: 400 }
        );
      }

      let dateTime: Date;
      if (hasDateTimeFormat) {
        dateTime = new Date(body.dateTime);
      } else {
        dateTime = new Date(`${body.date}T${body.slot.startTime}:00`);
      }

      const createAppointment = container.resolve(CreateAppointment);
      const appointment = await createAppointment.execute({
        activityId: body.activityId,
        dateTime,
        clientInfo: body.clientInfo,
      });

      // Send confirmation email to client asynchronously (don't block response)
      if (appointment.id) {
        const logger = new Logger();
        const sendConfirmation = container.resolve(SendAppointmentConfirmation);
        sendConfirmation
          .execute({ appointmentId: appointment.id })
          .catch((error) => {
            logger.logErrorWithObject(
              error,
              "Erreur lors de l'envoi de l'email de confirmation"
            );
          });

        // Send notification email to admin asynchronously
        const sendAdminNotification = container.resolve(
          SendAdminNewBookingNotification
        );
        sendAdminNotification
          .execute({ appointmentId: appointment.id })
          .catch((error) => {
            logger.logErrorWithObject(
              error,
              "Erreur lors de l'envoi de l'email de notification admin"
            );
          });
      }

      return NextResponse.json(appointmentToResponse(appointment), {
        status: 201,
      });
    } catch (error) {
      const logger = new Logger();
      logger.logErrorWithObject(
        error,
        'Erreur lors de la création du rendez-vous'
      );
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : 'Impossible de réserver le créneau',
        },
        { status: 400 }
      );
    }
  }
);
