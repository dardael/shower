import { NextResponse } from 'next/server';
import { PLACEHOLDER_DEFINITIONS } from '@/infrastructure/email/services/PlaceholderReplacer';

export async function GET(): Promise<NextResponse> {
  const placeholders = PLACEHOLDER_DEFINITIONS.map((p) => ({
    syntax: p.syntax,
    description: p.description,
  }));

  return NextResponse.json({ placeholders });
}
