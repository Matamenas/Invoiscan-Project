const express = require('express');
const bodyParser = require('body-parser');
const Tesseract = require('tesseract.js');
const app = express();

app.use(bodyParser.json({ limit: '10mb' })); // For larger images
app.use(express.static('public'));

// Endpoint to process image and extract text using Tesseract.js
app.post('/upload', (req, res) => {
    const base64Image = req.body.image.split(',')[1];

    // Use Tesseract.js to recognize text
    Tesseract.recognize(Buffer.from(base64Image, 'base64'), 'eng', {
        logger: m => console.log(m), // To see progress in the console
    })
    .then(({ data: { text } }) => {
        console.log("Full OCR Text:", text); // Log full OCR text

        // Regular expressions to match total, VAT, and store name
        const totalMatch = text.match(/total[\s\S]*?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i);
        const vatMatch = text.match(/vat[\s\S]*?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i);

        // Assume store name is the first line
        const lines = text.split("\n").filter(line => line.trim() !== "");
        const storeName = lines.length > 0 ? lines[0].trim() : "Store name not found";

        res.json({
            storeName,
            total: totalMatch ? totalMatch[1] : "Total not found",
            vat: vatMatch ? vatMatch[1] : "VAT not found",
            fullText: text // Full OCR text
        });
    })
    .catch(error => {
        console.error("Error during OCR processing:", error);
        res.status(500).json({ error: "OCR processing failed" });
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
