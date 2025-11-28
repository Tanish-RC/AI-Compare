


// export interface LLMCode {
//   code: string;
//   reasoning?: string;
//   audit_trail?: string;
//   modifiers?: string[];
// }

// export interface LLMSuggestions {
//   openai?: {
//     CPT_Codes?: LLMCode[];
//     ICD_Codes?: LLMCode[];
//   };
//   claude?: {
//     CPT_Codes?: LLMCode[];
//     ICD_Codes?: LLMCode[];
//   };
//   gemini?: {
//     CPT_Codes?: LLMCode[];
//     ICD_Codes?: LLMCode[];
//   };
// }

// export interface Chart {
//   _id: string;
//   name: string;
//   pdfUrl?: string;
//   createdAt: string;
//   client: string | { _id: string; name: string };
//   llmSuggestions?: LLMSuggestions;
//   content?: string;
// }

// export interface CodeModifier {
//   code: string;
//   description: string;
//   selected: boolean;
// }

// export interface CodeEntry {
//   code: string;
//   description: string;
//   llmSuggestions: LLMSuggestions;
//   selected: boolean;
//   feedback: string;
//   customModifiers: CodeModifier[];
// }

// export interface ChartCodes {
//   chartId: string;
//   cptCodes: CodeEntry[];
//   icdCodes: CodeEntry[];
// }


// ✅ Represents individual code objects returned by the backend
export interface LLMCode {
  code: string;
  reasoning?: string;
  audit_trail?: string;
  modifiers?: string[];
  selectedModifiers?: string[];
}

// ✅ Flattened LLM data structure for the UI (used in parser + table)
export interface LLMProviderFlattened {
  suggested: boolean;
  reasoning: string;
  audit_trail: string;
  modifiers: string[];
  selectedModifiers: string[];
}

// ✅ Used for parsed charts in the UI (flattened version)
export interface LLMSuggestions {
  openai: LLMProviderFlattened;
  claude: LLMProviderFlattened;
  gemini: LLMProviderFlattened;
}

// ✅ Used for raw backend payloads
export interface LLMRawSuggestions {
  openai?: {
    CPT_Codes?: LLMCode[];
    ICD_Codes?: LLMCode[];
  };
  claude?: {
    CPT_Codes?: LLMCode[];
    ICD_Codes?: LLMCode[];
  };
  gemini?: {
    CPT_Codes?: LLMCode[];
    ICD_Codes?: LLMCode[];
  };
}

// ✅ Chart document from backend
export interface Chart {
  _id: string;
  name: string;
  pdfUrl?: string;
  createdAt: string;
  client: string | { _id: string; name: string };
  llmSuggestions?: LLMRawSuggestions | string;
  content?: string;
}

// ✅ Code modifier structure
export interface CodeModifier {
  code: string;
  description: string;
  selected: boolean;
}

// ✅ UI Code entry (flattened, for rendering)
export interface CodeEntry {
  code: string;
  description: string;
  llmSuggestions: LLMSuggestions;
  selected: boolean;
  feedback: string;
  customModifiers: CodeModifier[];
}

// ✅ Grouped codes per chart
export interface ChartCodes {
  chartId: string;
  cptCodes: CodeEntry[];
  icdCodes: CodeEntry[];
}
