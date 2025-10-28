interface Client {
  id: string;
  name: string;
  createdAt: string;
  documents: Array<{
    id: string;
    name: string;
    uploadDate: string;
    status: 'processing' | 'completed' | 'error';
    results?: {
      openAI: any;
      gemini: any;
      claude: any;
    };
  }>;
}

const CLIENTS_STORAGE_KEY = 'ai_coder_clients';

export function getClients(): Client[] {
  if (typeof window === 'undefined') return [];
  const clients = localStorage.getItem(CLIENTS_STORAGE_KEY);
  return clients ? JSON.parse(clients) : [];
}

export function createClient(name: string): Client {
  const newClient: Client = {
    id: Date.now().toString(),
    name,
    createdAt: new Date().toISOString(),
    documents: [],
  };
  
  const clients = getClients();
  clients.push(newClient);
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
  
  return newClient;
}

export function addDocumentToClient(
  clientId: string, 
  docName: string, 
  results: { openAI: any; gemini: any; claude: any }
) {
  const clients = getClients();
  const clientIndex = clients.findIndex(c => c.id === clientId);
  
  if (clientIndex === -1) return null;
  
  const document = {
    id: Date.now().toString(),
    name: docName,
    uploadDate: new Date().toISOString(),
    status: 'completed' as const,
    results
  };
  
  clients[clientIndex].documents.push(document);
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
  
  return document;
}

export function updateDocumentStatus(
  clientId: string, 
  docId: string, 
  status: 'processing' | 'completed' | 'error',
  results?: { openAI: any; gemini: any; claude: any }
) {
  const clients = getClients();
  const client = clients.find(c => c.id === clientId);
  
  if (!client) return;
  
  const docIndex = client.documents.findIndex(d => d.id === docId);
  if (docIndex === -1) return;
  
  client.documents[docIndex].status = status;
  if (results) {
    client.documents[docIndex].results = results;
  }
  
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
}

export function getClientById(clientId: string): Client | null {
  const clients = getClients();
  return clients.find(c => c.id === clientId) || null;
}
