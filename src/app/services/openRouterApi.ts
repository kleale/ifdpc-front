const API_URL = "https://openrouter.ai/api/v1/chat/completions";

import axios, { AxiosResponse } from "axios";

class AIApiService {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseURL = API_URL;
  }

  async chatCompletion(
    messages: any[],
    options: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
    } = {}
  ): Promise<string> {
    try {
      const requestData: any = {
        model: options.model || "x-ai/grok-4.1-fast",
        messages,
        reasoning: { enabled: true },
        //temperature: options.temperature || 0.7,
        // max_tokens: options.max_tokens || 500,
        //stream: options.stream || false,
      };

      const response: AxiosResponse<any> = await axios.post(
        this.baseURL,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      debugger
      
      if (response.data.choices && response.data.choices.length > 0) {
        return response.data.choices[0].message.content;
      } else {
        throw new Error("No response from AI API");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as any;
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

${
  userMessage
    ? `Вопрос пользователя: ${userMessage}`
    : "Сгенерируй полезную подсказку на основе контекста"
}

Правила:
- Отвечай кратко и по делу
- Предлагай конкретные действия
- Будь дружелюбным и профессиональным
- Максимум 1-2 предложения
- Не используй markdown
- Говори на "ты"`;

    const messages: any[] = [
      { role: "system", content: systemPrompt },
      // { role: 'user', content: userMessage || 'Что можно сделать сейчас?' }
    ];

    return await this.chatCompletion(messages, {
      temperature: 0.5,
      max_tokens: 150,
    });
  }
}

// Создаем экземпляр сервиса (API ключ должен быть в .env)
export const AIService = new AIApiService(
  import.meta.env.VITE_REACT_APP_OPENROUTER_API_KEY
);
