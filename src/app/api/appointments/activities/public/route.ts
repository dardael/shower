import { NextResponse } from 'next/server';
import { container } from '@/infrastructure/container';
import { GetAllActivities } from '@/application/appointment/ActivityUseCases';
import { backendLog } from '@/infrastructure/shared/services/BackendLog';

export async function GET(): Promise<NextResponse> {
  try {
    const getAllActivities = container.resolve(GetAllActivities);
    const activities = await getAllActivities.execute();

    const publicActivities = activities.map((activity) => ({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      durationMinutes: activity.durationMinutes,
      price: activity.price,
      color: activity.color,
      requiredFields: activity.requiredFields.toObject(),
    }));

    return NextResponse.json(publicActivities);
  } catch (error) {
    backendLog.error(
      'Erreur lors de la récupération des activités publiques',
      { error }
    );
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des activités' },
      { status: 500 }
    );
  }
}
