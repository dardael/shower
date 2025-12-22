import { NextRequest, NextResponse } from 'next/server';
import { EmailServiceLocator } from '@/infrastructure/container';
import { GetEmailSettings } from '@/application/email/GetEmailSettings';
import { UpdateEmailSettings } from '@/application/email/UpdateEmailSettings';

export async function GET(): Promise<NextResponse> {
  try {
    const repository = EmailServiceLocator.getEmailSettingsRepository();
    const getEmailSettings = new GetEmailSettings(repository);
    const settings = await getEmailSettings.execute();

    return NextResponse.json({
      administratorEmail: settings.administratorEmail,
    });
  } catch (error) {
    console.error('Error getting email settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres email' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { administratorEmail } = body;

    if (!administratorEmail) {
      return NextResponse.json(
        { error: "L'adresse email administrateur est requise" },
        { status: 400 }
      );
    }

    const repository = EmailServiceLocator.getEmailSettingsRepository();
    const updateEmailSettings = new UpdateEmailSettings(repository);
    await updateEmailSettings.execute({ administratorEmail });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating email settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des paramètres email' },
      { status: 500 }
    );
  }
}
