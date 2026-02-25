import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import { GetAvailableDaysInWeek } from '@/application/appointment/AvailabilityUseCases';
import { withApi } from '@/infrastructure/shared/apiWrapper';
import { validateDateParam } from '@/presentation/appointment/apiMappers';

export const GET = withApi<NextResponse>(
  async (request: NextRequest): Promise<NextResponse> => {
    const { searchParams } = new URL(request.url);
    const activityId = searchParams.get('activityId');
    const weekStartStr = searchParams.get('weekStart');

    if (!activityId) {
      return NextResponse.json(
        { error: 'Le paramètre activityId est requis' },
        { status: 400 }
      );
    }

    if (!weekStartStr) {
      return NextResponse.json(
        { error: 'Le paramètre weekStart est requis' },
        { status: 400 }
      );
    }

    try {
      const weekStart = validateDateParam(weekStartStr);

      const getAvailableDaysInWeek = container.resolve(GetAvailableDaysInWeek);
      const days = await getAvailableDaysInWeek.execute({
        activityId,
        weekStart,
      });

      return NextResponse.json(days);
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
