import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import {
  GetAllActivities,
  CreateActivity,
} from '@/application/appointment/ActivityUseCases';
import { withApi } from '@/infrastructure/shared/apiWrapper';
import { activityToResponse } from '@/presentation/appointment/apiMappers';
import { validateActivityInput } from '../validation';

export const GET = withApi<NextResponse>(
  async (): Promise<NextResponse> => {
    const getAllActivities = container.resolve(GetAllActivities);
    const activities = await getAllActivities.execute();

    return NextResponse.json(activities.map(activityToResponse));
  },
  { requireAuth: true }
);

export const POST = withApi<NextResponse>(
  async (request: NextRequest): Promise<NextResponse> => {
    const body = await request.json();

    const validation = validateActivityInput(body);
    if (!validation.isValid()) {
      return NextResponse.json(
        { error: validation.getErrorMessage() },
        { status: 400 }
      );
    }

    const createActivity = container.resolve(CreateActivity);
    const activity = await createActivity.execute({
      name: body.name,
      description: body.description,
      durationMinutes: body.durationMinutes,
      color: body.color,
      price: body.price,
      requiredFields: body.requiredFields,
      reminderSettings: body.reminderSettings,
      minimumBookingNoticeHours: body.minimumBookingNoticeHours,
    });

    return NextResponse.json(activityToResponse(activity), { status: 201 });
  },
  { requireAuth: true }
);
