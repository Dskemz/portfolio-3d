import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const imagePath = pathSegments.join('/');
    const basePath = path.join(process.cwd(), 'public', imagePath);
    const dirPath = path.dirname(basePath);
    const fileName = path.basename(basePath);

    // Order of priority: jpg, png, webp, svg
    const extensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];

    // Check each extension in priority order
    for (const ext of extensions) {
      const fullPath = basePath + ext;
      const relativePath = imagePath + ext;

      try {
        // Check if file exists by trying to stat it
        await stat(fullPath);

        // File exists, redirect to it
        return NextResponse.redirect(new URL(`/${relativePath}`, req.url), {
          status: 307,
        });
      } catch {
        // File doesn't exist, continue to next extension
        continue;
      }
    }

    // No image found in any format
    return NextResponse.json(
      { error: 'Image not found', path: imagePath },
      { status: 404 }
    );
  } catch (error) {
    console.error('Image resolution error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
