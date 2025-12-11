export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIChatRequest {
  model: string;
  messages: AIMessage[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

export interface AIChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: AIMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIError {
  error: {
    message: string;
    type: string;
    code: string;
  };
}