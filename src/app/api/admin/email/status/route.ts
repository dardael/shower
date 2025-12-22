import { NextResponse } from 'next/server';
import { EmailServiceLocator } from '@/infrastructure/container';

export async function GET(): Promise<NextResponse> {
  try {
    const { GetEmailConfigurationStatus } = await import(
      '@/application/email/GetEmailConfigurationStatus'
    );

    const repository = EmailServiceLocator.getEmailSettingsRepository();
    const useCase = new GetEmailConfigurationStatus(repository);

    const status = await useCase.execute();

    return NextResponse.json(status);
  } catch (error) {
    console.error('Error fetching email configuration status:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du statut de configuration' },
      { status: 500 }
    );
  }
}
