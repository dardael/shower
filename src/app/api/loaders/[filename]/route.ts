import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { sanitizeFilename } from '@/infrastructure/shared/utils/filenameSanitizer';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ filename: string }> }
): Promise<NextResponse> {
  try {
    const { filename } = await props.params;

    if (!filename || typeof filename !== 'string') {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    const sanitizedFilename = sanitizeFilename(filename);

    const loadersDir = path.join(process.cwd(), 'public', 'loaders');
    const filePath = path.join(loadersDir, sanitizedFilename);

    const normalizedLoadersDir = path.normalize(loadersDir);
    const normalizedFilePath = path.normalize(filePath);

    if (!normalizedFilePath.startsWith(normalizedLoadersDir)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { error: 'Loader file not found' },
        { status: 404 }
      );
    }

    const fileBuffer = await fs.readFile(filePath);

    const ext = sanitizedFilename.split('.').pop()?.toLowerCase();
    let mimeType = 'application/octet-stream';

    switch (ext) {
      case 'gif':
        mimeType = 'image/gif';
        break;
      case 'mp4':
        mimeType = 'video/mp4';
        break;
      case 'webm':
        mimeType = 'video/webm';
        break;
    }

    const uint8Array = new Uint8Array(fileBuffer);

    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': uint8Array.length.toString(),
      },
    });
  } catch (error) {
    const logger = container.resolve<Logger>('Logger');
    logger.logErrorWithObject(error, 'Error serving loader file', { error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
