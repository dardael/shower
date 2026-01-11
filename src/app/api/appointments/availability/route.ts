import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import {
  GetAvailability,
  UpdateAvailability,
} from '@/application/appointment/AvailabilityUseCases';
import { Availability } from '@/domain/appointment/entities/Availability';
import { withApi } from '@/infrastructure/shared/apiWrapper';

function availabilityToResponse(
  availability: Availability
): Record<string, unknown> {
  return {
    id: availability.id,
    weeklySlots: availability.weeklySlots.map((slot) => ({
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
    })),
    exceptions: availability.exceptions.map((exception) => ({
      date: exception.date.toISOString().split('T')[0],
      reason: exception.reason,
    })),
  };
}

export const GET = withApi<NextResponse>(
  async (): Promise<NextResponse> => {
    const getAvailability = container.resolve(GetAvailability);
    const availability = await getAvailability.execute();

    return NextResponse.json(availabilityToResponse(availability));
  },
  { requireAuth: true }
);

export const PUT = withApi<NextResponse>(
  async (request: NextRequest): Promise<NextResponse> => {
    const body = await request.json();

    const updateAvailability = container.resolve(UpdateAvailability);
    const availability = await updateAvailability.execute({
      weeklySlots: body.weeklySlots,
      exceptions: body.exceptions,
    });

    return NextResponse.json(availabilityToResponse(availability));
  },
  { requireAuth: true }
);
