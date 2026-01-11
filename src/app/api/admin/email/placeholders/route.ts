import { NextRequest, NextResponse } from 'next/server';
import {
  PLACEHOLDER_DEFINITIONS,
  APPOINTMENT_PLACEHOLDER_DEFINITIONS,
} from '@/infrastructure/email/services/PlaceholderReplacer';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');

  let placeholders;

  if (
    type === 'appointment-booking' ||
    type === 'appointment-reminder' ||
    type === 'appointment-cancellation' ||
    type === 'appointment-admin-new' ||
    type === 'appointment-admin-confirmation'
  ) {
    placeholders = APPOINTMENT_PLACEHOLDER_DEFINITIONS.map((p) => ({
      syntax: p.syntax,
      description: p.description,
    }));
  } else {
    placeholders = PLACEHOLDER_DEFINITIONS.map((p) => ({
      syntax: p.syntax,
      description: p.description,
    }));
  }

  return NextResponse.json({ placeholders });
}
