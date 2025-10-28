# LLM Integration for AI Coder Compare

This document outlines the changes made to integrate LLM APIs into the AI Coder Compare application.

## Changes Made

### 1. API Service Layer
- Created `src/services/llmService.ts` - Core service for making API calls to different LLM providers
- Implemented three main functions:
  - `generateWithOpenAI`
  - `generateWithGemini`
  - `generateWithClaude`

### 2. Environment Configuration
- Added required environment variables to `.env.local` (see .env.example for reference)
- API keys are loaded from environment variables for security

### 3. Data Flow Updates
- Modified data flow to use real API responses instead of mock data
- Added loading and error states for better UX
- Implemented response caching to minimize API calls

## How to Use

1. Create a `.env.local` file in the project root with your API keys:
   ```
   OPENAI_API_KEY=your_openai_key
   GEMINI_API_KEY=your_gemini_key
   CLAUDE_API_KEY=your_claude_key
   ```

2. Import and use the LLM service:
   ```typescript
   import { generateWithOpenAI, generateWithGemini, generateWithClaude } from '@/services/llmService';
   
   // Example usage
   const response = await generateWithOpenAI('Your prompt here');
   ```

## Reverting Changes

To revert to using mock data:
1. In `src/pages/index.tsx`, change the import from:
   ```typescript
   import { processChartWithLLMs } from '@/services/llmService';
   ```
   back to:
   ```typescript
   import { mockCharts } from '@/data/mockData';
   ```

2. Update the chart processing logic to use mock data instead of API calls.

## Dependencies Added
- @google/generative-ai: ^0.1.0
- openai: ^4.0.0
- @anthropic-ai/sdk: ^0.1.0
- dotenv: ^16.0.0

## Notes
- API keys should never be committed to version control
- Consider implementing rate limiting for production use
- Monitor API usage to avoid unexpected costs
