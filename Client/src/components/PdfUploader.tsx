import { useState, useCallback } from 'react';
import { processPdfFiles } from '@/services/llmService';
import { processZipFile } from '@/utils/pdfUtils';

interface PdfUploaderProps {
  clientId: string;
  onProcessComplete: (results: any[]) => void;
}

export default function PdfUploader({ clientId, onProcessComplete }: PdfUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    
    try {
      let filesToProcess: Array<{ name: string; content: string }> = [];
      
      if (file.name.endsWith('.zip')) {
        // Process ZIP file
        const extractedFiles = await processZipFile(file);
        filesToProcess = extractedFiles;
      } else if (file.name.endsWith('.pdf')) {
        // Process single PDF
        const pdfText = await extractTextFromPdf(file);
        filesToProcess = [{
          name: file.name.replace(/\.pdf$/i, ''),
          content: pdfText
        }];
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or ZIP file.');
      }

      setProgress(30);
      
      // Process all files with LLMs
      const results = await processPdfFiles(filesToProcess, clientId);
      
      setProgress(100);
      onProcessComplete(results);
    } catch (err) {
      console.error('Error processing files:', err);
      setError(err instanceof Error ? err.message : 'Failed to process files');
    } finally {
      setIsProcessing(false);
    }
  }, [clientId, onProcessComplete]);

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          id="pdf-upload"
          accept=".pdf,.zip"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isProcessing}
        />
        <label
          htmlFor="pdf-upload"
          className="cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isProcessing ? 'Processing...' : 'Upload PDF or ZIP file'}
        </label>
        <p className="mt-1 text-sm text-gray-500">
          {isProcessing ? 'Processing your files...' : 'Drag and drop files here, or click to select files'}
        </p>
      </div>
      
      {isProcessing && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
}

async function extractTextFromPdf(file: File): Promise<string> {
  // This is a simplified version - in a real app, you'd use a proper PDF text extractor
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/extract-pdf-text', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to extract text from PDF');
  }
  
  const { text } = await response.json();
  return text;
}
