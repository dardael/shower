import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await props.params;

    // Validate filename to prevent directory traversal
    if (!filename || typeof filename !== 'string') {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    // Sanitize filename - only allow alphanumeric, hyphens, underscores, and dots
    if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
      return NextResponse.json(
        { error: 'Invalid filename format' },
        { status: 400 }
      );
    }

    // Construct file path
    const iconsDir = path.join(process.cwd(), 'public', 'icons');
    const filePath = path.join(iconsDir, filename);

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
    const ext = filename.split('.').pop()?.toLowerCase();
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
    console.error('Error serving icon:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
