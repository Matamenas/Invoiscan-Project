// pages/api/ocr.js
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

export default async function handler(req, res) {
  console.log("/api/ocrScanner called with method:", req.method);
  if (req.method === 'POST') {
    const { image } = req.body;

    try {
      const base64Image = image.split(',')[1]; // Get base64 data from the image

      const { data: { text } } = await Tesseract.recognize(Buffer.from(base64Image, 'base64'), 'eng', {
        // Logging OCR progress
        logger: (m) => console.log(m), 
      });

      // Extract information using regex
      const totalMatch = text.match(/(?:total|subtotal)[^\d\S]*((?:[\£\$\€]\d{1,5}(?:,\d{3})*(?:\.\d{2})?)|(?:\d{1,5}(?:,\d{3})*\.\d{2}))/i);
      const vatMatch = text.match(/(?:vat|tax)[\s\S]*?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i);

      // Date pattern for DD/MM/YYYY or DD.MM.YYYY formats
      const dateMatch = text.match(/\b(0?[1-9]|[12][0-9]|3[01])([\/.])(0?[1-9]|1[0-2])\2(\d{2}|\d{4})\b/);
      const vatRegMatch = text.match(/\b[A-Z]{2}\d{7}[A-Z]?\b/i);

      // Assume store name is the first line
      const lines = text.split("\n").filter(line => line.trim() !== "");
      const storeName = lines.length > 0 ? lines[0].trim() : "Store name not found";

      res.json({
        storeName,
        total: totalMatch ? totalMatch[1] : "Total not found",
        vat: vatMatch ? vatMatch[1] : "VAT not found",
        date: dateMatch ? dateMatch[0] : "Date not found",
        vatReg: vatRegMatch ? vatRegMatch[0] : "VAT Registration not found",
        fullText: text
      });
    } catch (error) {
      console.error("OCR processing error:", error);
      res.status(500).json({ error: "OCR processing failed" });
    }
  } else {
    console.warn("⛔️  Wrong method:", req.method);
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
