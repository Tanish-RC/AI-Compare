import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || '',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const { provider } = req.query;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    switch (provider) {
      case 'openai':
        const completion = await openai.chat.completions.create({
          messages: [
            { role: 'system', content: 'You are a medical coding assistant. Provide accurate and concise coding suggestions.' },
            { role: 'user', content: prompt }
          ],
          model: 'gpt-4',
          temperature: 0.3,
        });

        return res.status(200).json({
          content: completion.choices[0]?.message?.content || '',
          model: 'GPT-4',
          tokensUsed: completion.usage?.total_tokens || 0,
        });

      case 'gemini':
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent({
          contents: [{
            role: 'user',
            parts: [{ text: prompt }],
          }],
        });

        const response = await result.response;
        const text = response.text();

        return res.status(200).json({
          content: text,
          model: 'Gemini Pro',
          tokensUsed: 0,
        });

      case 'claude':
        const message = await anthropic.messages.create({
          model: 'claude-3-opus-20240229',
          max_tokens: 1000,
          messages: [
            { role: 'user', content: prompt }
          ],
        });

        return res.status(200).json({
          content: message.content[0]?.text || '',
          model: 'Claude 3 Opus',
          tokensUsed: (message.usage?.input_tokens || 0) + (message.usage?.output_tokens || 0),
        });

      default:
        return res.status(400).json({ error: 'Invalid provider' });
    }
  } catch (error) {
    console.error(`${provider} API Error:`, error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}
