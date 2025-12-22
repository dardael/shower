import { NextRequest, NextResponse } from 'next/server';
import { EmailServiceLocator } from '@/infrastructure/container';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { recipientEmail } = body;

    if (!recipientEmail) {
      return NextResponse.json(
        { error: "L'adresse email de test est requise" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json(
        { error: "L'adresse email de test n'est pas valide" },
        { status: 400 }
      );
    }

    const emailService = EmailServiceLocator.getEmailService();
    const result = await emailService.testConnection(recipientEmail);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email de test envoyé avec succès',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.errorMessage || 'Échec de la connexion SMTP',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error testing SMTP connection:', error);
    return NextResponse.json(
      { error: 'Erreur lors du test de connexion SMTP' },
      { status: 500 }
    );
  }
}
