import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const HERO_MEDIA_DIR = path.join(process.cwd(), 'public', 'hero-media');

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
): Promise<NextResponse> {
  const { filename } = await params;

  const sanitizedFilename = path.basename(filename);

  if (sanitizedFilename !== filename || filename.includes('..')) {
    return NextResponse.json(
      { error: 'Nom de fichier invalide' },
      { status: 400 }
    );
  }

  const filePath = path.join(HERO_MEDIA_DIR, sanitizedFilename);

  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(path.resolve(HERO_MEDIA_DIR))) {
    return NextResponse.json(
      { error: 'Nom de fichier invalide' },
      { status: 400 }
    );
  }

  try {
    const fileBuffer = await fs.readFile(filePath);
    const extension = path.extname(sanitizedFilename).toLowerCase();
    const contentType = MIME_TYPES[extension] || 'application/octet-stream';
    const uint8Array = new Uint8Array(fileBuffer);

    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 });
  }
}
