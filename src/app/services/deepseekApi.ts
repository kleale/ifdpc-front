import axios, { AxiosResponse } from 'axios';
import { AIChatRequest, AIChatResponse, AIError, AIMessage } from '../types/aiServiceTypes';


const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

class DeepSeekApiService {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseURL = DEEPSEEK_API_URL;
  }

  async chatCompletion(
    messages: AIMessage[],
    options: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
    } = {}
  ): Promise<string> {
    try {
      const requestData: AIChatRequest = {
        model: options.model || 'deepseek-chat',
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 500,
        stream: options.stream || false,
      };

      const response: AxiosResponse<AIChatResponse> = await axios.post(
        this.baseURL,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      if (response.data.choices && response.data.choices.length > 0) {
        return response.data.choices[0].message.content;
      } else {
        throw new Error('No response from DeepSeek API');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as AIError;
        throw new Error(apiError?.error?.message || error.message);
      }
      throw error;
    }
  }

  // Метод для быстрых контекстных подсказок
  async generateContextualSuggestion(
    context: string,
    userMessage?: string
  ): Promise<string> {
    const systemPrompt = `Ты - контекстный помощник в веб-приложении. 
Твоя задача - давать краткие, полезные и релевантные подсказки пользователю на основе контекста.

Контекст приложения: ${context}

${userMessage ? `Вопрос пользователя: ${userMessage}` : 'Сгенерируй полезную подсказку на основе контекста'}

Правила:
- Отвечай кратко и по делу
- Предлагай конкретные действия
- Будь дружелюбным и профессиональным
- Максимум 1-2 предложения
- Не используй markdown
- Говори на "ты"`;

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage || 'Что можно сделать сейчас?' }
    ];

    return await this.chatCompletion(messages, {
      temperature: 0.5,
      max_tokens: 150
    });
  }
}

// Создаем экземпляр сервиса (API ключ должен быть в .env)
export const deepSeekService = new DeepSeekApiService(
  import.meta.env.VITE_REACT_APP_DEEPSEEK_API_KEY
);