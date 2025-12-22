import { NextRequest, NextResponse } from 'next/server';
import { EmailServiceLocator } from '@/infrastructure/container';

export async function GET(): Promise<NextResponse> {
  try {
    const repository = EmailServiceLocator.getEmailSettingsRepository();
    const template = await repository.getEmailTemplate('purchaser');

    return NextResponse.json({
      subject: template?.subject || '',
      body: template?.body || '',
      enabled: template?.enabled || false,
    });
  } catch (error) {
    console.error('Error getting purchaser email template:', error);
    return NextResponse.json(
      { error: 'Impossible de récupérer le template' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { subject, body: templateBody, enabled } = body;

    if (!subject || !templateBody) {
      return NextResponse.json(
        { error: 'Le sujet et le corps du message sont requis' },
        { status: 400 }
      );
    }

    const repository = EmailServiceLocator.getEmailSettingsRepository();
    const { EmailTemplate } = await import(
      '@/domain/email/entities/EmailTemplate'
    );

    const template = EmailTemplate.create({
      type: 'purchaser',
      subject,
      body: templateBody,
      enabled: enabled ?? false,
    });

    await repository.saveEmailTemplate(template);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating purchaser email template:', error);
    return NextResponse.json(
      { error: 'Impossible de sauvegarder le template' },
      { status: 500 }
    );
  }
}
