import { NextRequest, NextResponse } from 'next/server';
import { EmailServiceLocator } from '@/infrastructure/container';

export async function GET(): Promise<NextResponse> {
  try {
    const repository = EmailServiceLocator.getEmailSettingsRepository();
    const settings = await repository.getSmtpSettings();

    return NextResponse.json({
      host: settings.host,
      port: settings.port,
      username: settings.username,
      encryptionType: settings.encryptionType,
      isConfigured: settings.isConfigured(),
    });
  } catch (error) {
    console.error('Error fetching SMTP settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres SMTP' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { host, port, username, password, encryptionType } = body;

    if (!host || !port || !username || !encryptionType) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    const repository = EmailServiceLocator.getEmailSettingsRepository();
    const { SmtpSettings } = await import(
      '@/domain/email/entities/SmtpSettings'
    );

    // Preserve existing password if not explicitly provided
    let finalPassword = password;
    if (password === undefined || password === '') {
      const existingSettings = await repository.getSmtpSettings();
      if (existingSettings.password) {
        finalPassword = existingSettings.password;
      } else {
        finalPassword = '';
      }
    }

    const settings = SmtpSettings.create({
      host,
      port: Number(port),
      username,
      password: finalPassword,
      encryptionType,
    });

    await repository.saveSmtpSettings(settings);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating SMTP settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des paramètres SMTP' },
      { status: 500 }
    );
  }
}
