import { NextRequest, NextResponse } from 'next/server';
import formidable, { File } from 'formidable';
import fs from 'fs';
import { getClient } from '@/sanity/lib/sanity.client';
import { writeToken } from '@/sanity/lib/sanity.api';

// Disable Next.js body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req: NextRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const form = formidable({ multiples: false, keepExtensions: true });

  return new Promise((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    const { files } = await parseForm(req);
    const imageInput = files?.image as formidable.File[] | undefined;
    const imageFile =   Array.isArray(imageInput) ? imageInput[0] : imageInput;

    if (!imageFile || !imageFile.filepath) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const client = getClient({ token: writeToken });

    const fileBuffer = fs.readFileSync(imageFile.filepath);

    const uploadedAsset = await client.assets.upload('image', fileBuffer, {
      filename: imageFile.originalFilename || 'upload.png',
      contentType: imageFile.mimetype || 'image/png',
    });

    return NextResponse.json({ success: true, asset: uploadedAsset });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
