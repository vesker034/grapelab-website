import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface RouteParams {
  params: {
    scope: string;
    filename: string;
  };
}

const fallbackPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
  'base64'
);

const ALLOWED_SCOPES = new Set([
  'blog',
  'devdirections',
  'employees',
  'general',
  'partners',
  'projects',
  'reviews',
  'services',
  'services_categories',
]);

const ALLOWED_MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { scope, filename } = params;

    if (!ALLOWED_SCOPES.has(scope)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const baseDir = path.resolve(process.cwd(), 'public', 'uploads');
    const filePath = path.resolve(baseDir, scope, filename);

    if (!filePath.startsWith(baseDir + path.sep)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const ext = path.extname(filename).toLowerCase();
    if (!ALLOWED_MIME_TYPES[ext]) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    try {
      await fs.access(filePath);
    } catch {
      return new NextResponse(fallbackPng, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'no-store',
        },
      });
    }

    const fileBuffer = await fs.readFile(filePath);
    const contentType = ALLOWED_MIME_TYPES[ext];

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
