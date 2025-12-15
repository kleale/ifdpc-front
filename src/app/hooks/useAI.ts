import { useState, useCallback } from 'react';
//import { deepSeekService } from '../services/deepseekApi';
import { AIService } from '../services/openRouterApi';
import { AIMessage } from '../types/aiServiceTypes';

interface UseAIReturn {
  isGenerating: boolean;
  error: string | null;
  generateResponse: (
    messages: AIMessage[], 
    context?: string
  ) => Promise<string>;
  generateSuggestion: (context: string, userMessage?: string) => Promise<string>;
  clearError: () => void;
}

export const useAI = (): UseAIReturn => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = useCallback(async (
    messages: AIMessage[],
    context?: string
  ): Promise<string> => {
    setIsGenerating(true);
    setError(null);

    try {
      // Добавляем контекст в системное сообщение если нужно
      if (context) {
        const systemMessage: AIMessage = {
          role: 'system',
          content: `Ты - полезный AI-ассистент в веб-приложении. Контекст: ${context}. Отвечай кратко и полезно.`
        };
        messages = [systemMessage, ...messages];
      }

      const response = await AIService.chatCompletion(messages);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateSuggestion = useCallback(async (
    context: string,
    userMessage?: string
  ): Promise<string> => {
    setIsGenerating(true);
    setError(null);

    try {
      const suggestion = await AIService.generateContextualSuggestion(context, userMessage);
      return suggestion;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      // Возвращаем fallback подсказку в случае ошибки
      return '' //'Продолжайте исследовать возможности приложения. Я здесь, чтобы помочь!';
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return {
    isGenerating,
    error,
    generateResponse,
    generateSuggestion,
    clearError
  };
};