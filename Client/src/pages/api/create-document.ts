import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient, addDocumentToClient, updateDocumentStatus } from '@/services/clientService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { clientId, name, content } = req.body;

  if (!clientId || !name || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // In a real app, you would save this to a database
    const documentId = `doc-${Date.now()}`;
    
    // Update the client's document list
    const document = {
      id: documentId,
      name,
      uploadDate: new Date().toISOString(),
      status: 'processing' as const,
    };

    // In a real app, you would save the document to a database here
    // For now, we'll just return the document ID
    
    return res.status(200).json({ 
      success: true, 
      documentId,
      document
    });
  } catch (error) {
    console.error('Error creating document:', error);
    return res.status(500).json({ 
      error: 'Failed to create document',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
