import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { createHash } from 'crypto';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    console.log(`Error uploading file`);
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Calculate the MD5 hash of the file
  const md5Hash = createHash('md5').update(buffer).digest('hex');
  
  // Define the path to the public/uploads directory
  const uploadPath = join(process.cwd(), 'public', 'uploads', file.name);

  // Write the file to the specified path
  await writeFile(uploadPath, buffer);

  console.log(`File uploaded successfully to: ${uploadPath}`);
  console.log(`MD5 hash of the file: ${md5Hash}`);
  
  return NextResponse.json({ success: true });
}
