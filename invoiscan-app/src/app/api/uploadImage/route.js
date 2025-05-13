import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { Readable } from 'stream';

// Cloudinary config
cloudinary.config({
  cloud_name: 'dgivqglqv',
  api_key: '722492785528877',
  api_secret: 'PY1VMqWAAO36LgOMhSMnsfybyNs',
});

// Helper to convert Web stream to Buffer
async function streamToBuffer(readableStream) {
  const chunks = [];
  for await (const chunk of readableStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

// POST method for image upload
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ folder: 'receipts' }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      Readable.from(buffer).pipe(uploadStream);
    });

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
