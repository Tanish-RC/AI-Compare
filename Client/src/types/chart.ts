// export interface Chart {
//   id: string;
//   name: string;
//   patientName: string;
//   date: string;
//   content: string;
//   approved: boolean;
// }

// export interface LLMSuggestion {
//   suggested: boolean;
//   reasoning: string;
//   auditTrail: string;
//   modifiers: string[];
//   selectedModifiers?: string[];
// }

// export interface Modifier {
//   code: string;
//   description: string;
//   selected: boolean;
// }

// export interface CodeSuggestion {
//   code: string;
//   description: string;
//   llmSuggestions: {
//     llm1: LLMSuggestion;
//     llm2: LLMSuggestion;
//     llm3: LLMSuggestion;
//   };
//   selected: boolean;
//   feedback: string;
//   isExternal?: boolean;
//   customModifiers: Modifier[];
// }

// export interface ChartCodes {
//   chartId: string;
//   cptCodes: CodeSuggestion[];
//   icdCodes: CodeSuggestion[];
// }

export interface Chart {
  id: string;
  name: string;
  patientName: string;
  date: string;
  content: string;
  pdfUrl:string;
  approved: boolean;
}

export interface LLMSuggestion {
  suggested: boolean;
  reasoning: string;
  auditTrail: string;
  modifiers: string[];
  selectedModifiers?: string[];
}

export interface Modifier {
  code: string;
  description: string;
  selected: boolean;
}

export interface CodeSuggestion {
  code: string;
  description: string;
  llmSuggestions: {
    llm1: LLMSuggestion;
    llm2: LLMSuggestion;
    llm3: LLMSuggestion;
  };
  selected: boolean;
  feedback: string;
  isExternal?: boolean;
  customModifiers: Modifier[];
}

export interface ChartCodes {
  chartId: string;
  cptCodes: CodeSuggestion[];
  icdCodes: CodeSuggestion[];
}
