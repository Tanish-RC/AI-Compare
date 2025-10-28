import { PDFDocument } from 'pdf-lib';

export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    let text = '';
    
    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
      const page = pdfDoc.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + '\n';
    }
    
    return text.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export async function processZipFile(zipFile: File): Promise<Array<{ name: string; content: string }>> {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  const content = await zip.loadAsync(zipFile);
  const pdfFiles: Array<{ name: string; content: string }> = [];

  for (const [filename, file] of Object.entries(content.files)) {
    if (filename.endsWith('.pdf') && !file.dir) {
      const arrayBuffer = await file.async('arraybuffer');
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      let text = '';
      
      for (let i = 0; i < pdfDoc.getPageCount(); i++) {
        const page = pdfDoc.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ') + '\n';
      }
      
      pdfFiles.push({
        name: filename.replace(/\.pdf$/i, ''),
        content: text.trim()
      });
    }
  }

  return pdfFiles;
}
