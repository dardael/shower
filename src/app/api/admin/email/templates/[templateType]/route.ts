import { NextRequest, NextResponse } from 'next/server';
import { EmailServiceLocator } from '@/infrastructure/container';
import { EmailTemplate } from '@/domain/email/entities/EmailTemplate';
import { withApiParams } from '@/infrastructure/shared/apiWrapper';
import { Logger } from '@/application/shared/Logger';

const VALID_TEMPLATE_TYPES = [
  'admin',
  'purchaser',
  'appointment-booking',
  'appointment-reminder',
  'appointment-cancellation',
  'appointment-admin-new',
  'appointment-admin-confirmation',
] as const;

type TemplateType = (typeof VALID_TEMPLATE_TYPES)[number];

function isValidTemplateType(type: string): type is TemplateType {
  return VALID_TEMPLATE_TYPES.includes(type as TemplateType);
}

async function handleGET(
  _request: NextRequest,
  context: { params: Promise<{ templateType: string }> }
): Promise<NextResponse> {
  const logger = new Logger();

  try {
    const { templateType } = await context.params;

    if (!isValidTemplateType(templateType)) {
      return NextResponse.json(
        { error: 'Type de template invalide' },
        { status: 400 }
      );
    }

    const repository = EmailServiceLocator.getEmailSettingsRepository();
    const template = await repository.getEmailTemplate(templateType);

    if (template) {
      return NextResponse.json({
        subject: template.subject,
        body: template.body,
        enabled: template.enabled,
      });
    }

    const defaultTemplate = EmailTemplate.createDefault(templateType);
    return NextResponse.json({
      subject: defaultTemplate.subject,
      body: defaultTemplate.body,
      enabled: defaultTemplate.enabled,
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération du template email', { error });
    return NextResponse.json(
      { error: 'Impossible de récupérer le template' },
      { status: 500 }
    );
  }
}

async function handlePUT(
  request: NextRequest,
  context: { params: Promise<{ templateType: string }> }
): Promise<NextResponse> {
  const logger = new Logger();

  try {
    const { templateType } = await context.params;

    if (!isValidTemplateType(templateType)) {
      return NextResponse.json(
        { error: 'Type de template invalide' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { subject, body: templateBody, enabled } = body;

    if (!subject || !templateBody) {
      return NextResponse.json(
        { error: 'Le sujet et le corps du message sont requis' },
        { status: 400 }
      );
    }

    const repository = EmailServiceLocator.getEmailSettingsRepository();

    const template = EmailTemplate.create({
      type: templateType,
      subject,
      body: templateBody,
      enabled: enabled ?? false,
    });

    await repository.saveEmailTemplate(template);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du template email', { error });
    return NextResponse.json(
      { error: 'Impossible de sauvegarder le template' },
      { status: 500 }
    );
  }
}

export const GET = withApiParams(handleGET, { requireAuth: true });
export const PUT = withApiParams(handlePUT, { requireAuth: true });
