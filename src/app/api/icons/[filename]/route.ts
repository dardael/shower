import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { sanitizeFilename } from '@/infrastructure/shared/utils/filenameSanitizer';
import { container } from '@/infrastructure/container';
import { Logger } from '@/application/shared/Logger';

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await props.params;

    // Validate and sanitize filename to prevent directory traversal
    if (!filename || typeof filename !== 'string') {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    // Sanitize filename using utility function
    const sanitizedFilename = sanitizeFilename(filename);

    // Construct file path
    const iconsDir = path.join(process.cwd(), 'public', 'icons');
    const filePath = path.join(iconsDir, sanitizedFilename);

    // Ensure the file is within the icons directory
    const normalizedIconsDir = path.normalize(iconsDir);
    const normalizedFilePath = path.normalize(filePath);

    if (!normalizedFilePath.startsWith(normalizedIconsDir)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read file
    const fileBuffer = await fs.readFile(filePath);

    // Determine MIME type based on file extension
    const ext = sanitizedFilename.split('.').pop()?.toLowerCase();
    let mimeType = 'image/x-icon'; // default

    switch (ext) {
      case 'png':
        mimeType = 'image/png';
        break;
      case 'jpg':
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'svg':
        mimeType = 'image/svg+xml';
        break;
      case 'gif':
        mimeType = 'image/gif';
        break;
      case 'webp':
        mimeType = 'image/webp';
        break;
      case 'ico':
        mimeType = 'image/x-icon';
        break;
    }

    // Convert Buffer to Uint8Array for NextResponse
    const uint8Array = new Uint8Array(fileBuffer);

    // Return file with appropriate headers
    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
        'Content-Length': uint8Array.length.toString(),
      },
    });
  } catch (error) {
    const logger = container.resolve<Logger>('Logger');
    logger.logError(error, 'Error serving icon', { error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
