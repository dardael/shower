import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import {
  GetActivityById,
  UpdateActivity,
  DeleteActivity,
} from '@/application/appointment/ActivityUseCases';
import { withApiParams } from '@/infrastructure/shared/apiWrapper';
import { activityToResponse } from '@/presentation/appointment/apiMappers';
import { validateActivityInput } from '../../validation';

interface RouteParams {
  id: string;
}

export const GET = withApiParams<RouteParams, NextResponse>(
  async (
    _request: NextRequest,
    { params }: { params: Promise<RouteParams> }
  ): Promise<NextResponse> => {
    const { id } = await params;

    const getActivityById = container.resolve(GetActivityById);
    const activity = await getActivityById.execute(id);

    if (!activity) {
      return NextResponse.json(
        { error: 'Activité non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(activityToResponse(activity));
  },
  { requireAuth: true }
);

export const PUT = withApiParams<RouteParams, NextResponse>(
  async (
    request: NextRequest,
    { params }: { params: Promise<RouteParams> }
  ): Promise<NextResponse> => {
    const { id } = await params;
    const body = await request.json();

    const validation = validateActivityInput(body);
    if (!validation.isValid()) {
      return NextResponse.json(
        { error: validation.getErrorMessage() },
        { status: 400 }
      );
    }

    const updateActivity = container.resolve(UpdateActivity);
    const activity = await updateActivity.execute({
      id,
      name: body.name,
      description: body.description,
      durationMinutes: body.durationMinutes,
      color: body.color,
      price: body.price,
      requiredFields: body.requiredFields,
      reminderSettings: body.reminderSettings,
      minimumBookingNoticeHours: body.minimumBookingNoticeHours,
    });

    return NextResponse.json(activityToResponse(activity));
  },
  { requireAuth: true }
);

export const DELETE = withApiParams<RouteParams, NextResponse>(
  async (
    _request: NextRequest,
    { params }: { params: Promise<RouteParams> }
  ): Promise<NextResponse> => {
    const { id } = await params;

    const deleteActivity = container.resolve(DeleteActivity);
    await deleteActivity.execute(id);

    return new NextResponse(null, { status: 204 });
  },
  { requireAuth: true }
);
