import { AiMode, AiTone } from '../types';

export interface AiEditRequest {
  text: string;
  mode: AiMode;
  targetTone?: AiTone;
  customPrompt?: string;
}

export interface AiEditResponse {
  result?: string;
  error?: string;
}

export async function requestAiEdit(params: AiEditRequest): Promise<string> {
  const response = await fetch('/api/ai-edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const data: AiEditResponse = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error || 'خطا در ارتباط با سرور هوش مصنوعی.');
  }

  return data.result || '';
}
