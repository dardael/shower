import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import { GetAppointmentsByDateRange } from '@/application/appointment/AppointmentUseCases';
import { GetAllActivities } from '@/application/appointment/ActivityUseCases';
import { withApi } from '@/infrastructure/shared/apiWrapper';
import { validateDateParam } from '@/presentation/appointment/apiMappers';

export const GET = withApi<NextResponse>(
  async (request: NextRequest): Promise<NextResponse> => {
    const { searchParams } = new URL(request.url);
    const startStr = searchParams.get('start');
    const endStr = searchParams.get('end');

    if (!startStr || !endStr) {
      return NextResponse.json(
        { error: 'Les paramètres start et end sont requis' },
        { status: 400 }
      );
    }

    try {
      const startDate = validateDateParam(startStr);
      const endDate = validateDateParam(endStr);

      const getAppointmentsByDateRange = container.resolve(
        GetAppointmentsByDateRange
      );
      const getAllActivities = container.resolve(GetAllActivities);

      const [appointments, activities] = await Promise.all([
        getAppointmentsByDateRange.execute({ startDate, endDate }),
        getAllActivities.execute(),
      ]);

      const activityColorMap = new Map(
        activities.map((activity) => [activity.id, activity.color])
      );

      const activeAppointments = appointments.filter(
        (apt) => apt.status.value !== 'cancelled'
      );

      const events = activeAppointments.map((apt) => {
        const activityColor = activityColorMap.get(apt.activityId) || '#3182ce';

        return {
          id: apt.id,
          title: `${apt.activityName} - ${apt.clientInfo.toObject().name}`,
          start: apt.dateTime.toISOString(),
          end: apt.endDateTime.toISOString(),
          color: activityColor,
          extendedProps: {
            activityId: apt.activityId,
            activityName: apt.activityName,
            clientInfo: apt.clientInfo.toObject(),
            status: apt.status.value,
          },
        };
      });

      return NextResponse.json(events);
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : 'Format de date invalide',
        },
        { status: 400 }
      );
    }
  },
  { requireAuth: true }
);
