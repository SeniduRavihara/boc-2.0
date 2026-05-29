import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { svg } = await request.json();
    const filePath = path.join(process.cwd(), 'debug_capture.svg');
    fs.writeFileSync(filePath, svg, 'utf8');
    return NextResponse.json({ success: true, path: filePath });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
