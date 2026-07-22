const { PDFParse } = require('pdf-parse');

async function extractTextFromPdf(buffer) {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text;
}

module.exports = { extractTextFromPdf };