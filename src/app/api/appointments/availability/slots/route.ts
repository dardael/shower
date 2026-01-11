import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import { GetAvailableSlots } from '@/application/appointment/AvailabilityUseCases';
import { withApi } from '@/infrastructure/shared/apiWrapper';
import { validateDateParam } from '@/presentation/appointment/apiMappers';

export const GET = withApi<NextResponse>(
  async (request: NextRequest): Promise<NextResponse> => {
    const { searchParams } = new URL(request.url);
    const activityId = searchParams.get('activityId');
    const dateStr = searchParams.get('date');

    if (!activityId) {
      return NextResponse.json(
        { error: 'Le paramètre activityId est requis' },
        { status: 400 }
      );
    }

    if (!dateStr) {
      return NextResponse.json(
        { error: 'Le paramètre date est requis' },
        { status: 400 }
      );
    }

    try {
      const date = validateDateParam(dateStr);

      const getAvailableSlots = container.resolve(GetAvailableSlots);
      const slots = await getAvailableSlots.execute({ activityId, date });

      return NextResponse.json(
        slots.map((slot) => ({
          startTime: slot.startTime.toISOString(),
          endTime: slot.endTime.toISOString(),
        }))
      );
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : 'Format de date invalide',
        },
        { status: 400 }
      );
    }
  }
);
