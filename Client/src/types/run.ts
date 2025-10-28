export interface LLMResult {
  model: 'GPT' | 'Claude' | 'Gemini';
  score: number;
  analysisTime: number; // in seconds
  wordCount: number;
  summary: string;
  confidenceScore?: number;
  timestamp: string;
}

export interface Run {
  id: string;
  clientName: string;
  dateTime: string;
  totalCharts: number;
  processedCharts: number;
  status: "pending" | "processing" | "completed" | "failed";
  llmResults?: LLMResult[];
  comparisonMetrics?: {
    bestModel: 'GPT' | 'Claude' | 'Gemini';
    averageScore: number;
    fastestModel: 'GPT' | 'Claude' | 'Gemini';
    averageTime: number;
  };
}

export interface Client {
  id: string;
  name: string;
  totalRuns: number;
  lastRunDate: string;
  lastLLMResults?: LLMResult[];
}
