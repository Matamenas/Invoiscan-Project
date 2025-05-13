// pages/api/ocr.js
import { Category } from '@mui/icons-material';
import Tesseract from 'tesseract.js';

// to allow larger images to uploaded we need this here
export const config = {
  api: {
    bodyParser: {
      // we can adjust this to limit the size
      sizeLimit: '10mb',
    },
  },
};
export const runtime = 'nodejs'; // Optional but helps in some environments

export async function POST(request) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return new Response(JSON.stringify({ error: "No image provided" }), { status: 400 });
    }

    const base64Image = image.split(',')[1]; // Get base64 data from the image

    const {
      data: { text },
    } = await Tesseract.recognize(Buffer.from(base64Image, 'base64'), 'eng', {
      logger: (m) => console.log(m),
    });

    // Extract fields
    const totalMatch = text.match(/(?:total|subtotal)[^\d\S]*((?:[\£\$\€]\d{1,5}(?:,\d{3})*(?:\.\d{2})?)|(?:\d{1,5}(?:,\d{3})*\.\d{2}))/i);
    const vatMatch = text.match(/(?:vat|tax)[\s\S]*?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i);
    const dateMatch = text.match(/\b(0?[1-9]|[12][0-9]|3[01])([\/.])(0?[1-9]|1[0-2])\2(\d{2}|\d{4})\b/);
    const vatRegMatch = text.match(/\b[A-Z]{2}\d{7}[A-Z]?\b/i);
    const lines = text.split("\n").filter(line => line.trim() !== "");
    const storeName = lines.length > 0 ? lines[0].trim() : "Store name not found";

    return new Response(
      JSON.stringify({
        storeName,
        total: totalMatch ? totalMatch[1] : "Total not found",
        vat: vatMatch ? vatMatch[1] : "VAT not found",
        date: dateMatch ? dateMatch[0] : "Date not found",
        vatReg: vatRegMatch ? vatRegMatch[0] : "VAT Registration not found",
        fullText: text
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("OCR processing error:", error);
    return new Response(JSON.stringify({ error: "OCR processing failed" }), {
      status: 500,
    });
  }
}
