import { NextRequest, NextResponse } from 'next/server';
import { EmailServiceLocator } from '@/infrastructure/container';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const status = searchParams.get('status') as
      | 'sent'
      | 'failed'
      | 'all'
      | null;
    const orderId = searchParams.get('orderId') || undefined;

    const { GetEmailLogs } = await import('@/application/email/GetEmailLogs');

    const repository = EmailServiceLocator.getEmailSettingsRepository();
    const useCase = new GetEmailLogs(repository);

    const result = await useCase.execute({
      page,
      limit,
      status: status || 'all',
      orderId,
    });

    return NextResponse.json({
      logs: result.logs.map((log) => ({
        id: log.id,
        orderId: log.orderId,
        type: log.type,
        recipient: log.recipient,
        subject: log.subject,
        status: log.status,
        errorMessage: log.errorMessage,
        sentAt: log.sentAt.toISOString(),
      })),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching email logs:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des logs email' },
      { status: 500 }
    );
  }
}
