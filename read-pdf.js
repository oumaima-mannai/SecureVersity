const fs = require('fs');

// Use pdfjs-dist for text extraction
async function extractText() {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(fs.readFileSync('ISO27001_Questionnaire_Par_Roles.pdf'));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  let fullText = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += `\n--- PAGE ${i} ---\n${pageText}`;
  }
  console.log(fullText);
}

extractText().catch(console.error);
