import type { NextApiRequest, NextApiResponse } from 'next';
import { updateDocumentStatus } from '@/services/clientService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { clientId, documentId, status, results, error } = req.body;

  if (!clientId || !documentId || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // In a real app, you would update the document in the database
    // For now, we'll just return success
    
    return res.status(200).json({ 
      success: true, 
      documentId,
      status,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating document:', error);
    return res.status(500).json({ 
      error: 'Failed to update document',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
