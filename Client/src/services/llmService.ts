interface LLMResponse {
  content: string;
  model: string;
  tokensUsed: number;
  error?: string;
}

const API_BASE_URL = '/api/llm';

export async function generateWithOpenAI(prompt: string): Promise<LLMResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/openai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return {
      content: '',
      model: 'GPT-4',
      tokensUsed: 0,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function generateWithGemini(prompt: string): Promise<LLMResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/gemini`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      content: '',
      model: 'Gemini Pro',
      tokensUsed: 0,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function generateWithClaude(prompt: string): Promise<LLMResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/claude`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Claude API Error:', error);
    return {
      content: '',
      model: 'Claude 3 Opus',
      tokensUsed: 0,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function processChartWithLLMs(chartContent: string, clientId: string, documentId: string): Promise<{
  openAI: LLMResponse;
  gemini: LLMResponse;
  claude: LLMResponse;
}> {
  const prompt = `Analyze the following medical chart and provide the appropriate medical codes:
  
  ${chartContent}
  
  Please provide the codes in a structured JSON format with the following structure:
  {
    "codes": [
      {"code": "ICD-10-CM A00.0", "description": "Cholera due to Vibrio cholerae 01, biovar cholerae"},
      ...
    ],
    "summary": "Brief summary of the medical condition"
  }`;

  // Process with all three models in parallel
  const [openAI, gemini, claude] = await Promise.all([
    generateWithOpenAI(prompt),
    generateWithGemini(prompt),
    generateWithClaude(prompt),
  ]);

  // Update document with results
  if (clientId && documentId) {
    try {
      await fetch('/api/update-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          documentId,
          results: { openAI, gemini, claude },
          status: 'completed'
        })
      });
    } catch (error) {
      console.error('Failed to update document status:', error);
    }
  }

  return { openAI, gemini, claude };
}

export async function processPdfFiles(
  files: Array<{ name: string; content: string }>,
  clientId: string
): Promise<Array<{ name: string; results: any }>> {
  const results = [];
  
  for (const file of files) {
    try {
      // Create document in the system
      const docResponse = await fetch('/api/create-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          name: file.name,
          content: file.content
        })
      });
      
      const { documentId } = await docResponse.json();
      
      // Process the document with all LLMs
      const result = await processChartWithLLMs(file.content, clientId, documentId);
      results.push({ name: file.name, results: result });
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
      // Update document status to error
      await fetch('/api/update-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          documentId: `temp-${Date.now()}`,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      });
    }
  }
  
  return results;
}
