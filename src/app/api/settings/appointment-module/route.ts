import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import {
  GetAppointmentModuleEnabled,
  UpdateAppointmentModuleEnabled,
} from '@/application/appointment/AppointmentModuleUseCases';
import { AppointmentModuleEnabled } from '@/domain/appointment/value-objects/AppointmentModuleEnabled';
import { withApi } from '@/infrastructure/shared/apiWrapper';

export const GET = withApi<NextResponse>(async (): Promise<NextResponse> => {
  const getAppointmentModuleEnabled = container.resolve(
    GetAppointmentModuleEnabled
  );
  const result = await getAppointmentModuleEnabled.execute();

  return NextResponse.json({ enabled: result.enabled });
});

export const PUT = withApi<NextResponse>(
  async (request: NextRequest): Promise<NextResponse> => {
    const body = await request.json();
    const { enabled } = body;

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Le champ enabled doit être un booléen' },
        { status: 400 }
      );
    }

    const updateAppointmentModuleEnabled = container.resolve(
      UpdateAppointmentModuleEnabled
    );
    const moduleEnabled = AppointmentModuleEnabled.create(enabled);
    await updateAppointmentModuleEnabled.execute(moduleEnabled);

    return NextResponse.json({ success: true, enabled });
  },
  { requireAuth: true }
);
