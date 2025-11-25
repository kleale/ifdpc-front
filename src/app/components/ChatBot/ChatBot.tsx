import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { useContextSuggestions } from '../../hooks/useContextSuggestions';
import { useDeepSeek } from '../../hooks/useDeepSeek';
import ChatMessage from './ChatMessage';
import { Message, QuickAction, DeepSeekMessage } from '../../types';
import './styles.css';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Здравствуйте! Я ваш AI-помощник на базе DeepSeek. Готов помочь с работой в приложении!',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const { suggestions, isLoading } = useContextSuggestions();
  const { generateResponse, isGenerating, error } = useDeepSeek();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Автоматически добавляем контекстные подсказки при изменении контекста
  useEffect(() => {
    if (isOpen && suggestions.length > 0 && !isLoading) {
      const lastMessage = messages[messages.length - 1];
      
      // Добавляем подсказку только если предыдущее сообщение не было подсказкой
      if (!lastMessage.isSuggestion && !lastMessage.isBot) {
        const suggestionMessage: Message = {
          id: Date.now(),
          text: `💡 ${suggestions[0]}`,
          isBot: true,
          isSuggestion: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, suggestionMessage]);
      }
    }
  }, [suggestions, isOpen, messages, isLoading]);

  // Обработка ошибок API
  useEffect(() => {
    if (error) {
      const errorMessage: Message = {
        id: Date.now(),
        text: 'Извините, произошла ошибка при подключении к AI. Пожалуйста, попробуйте позже.',
        isBot: true,
        isError: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }, [error]);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;

    // Добавляем сообщение пользователя
    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Показываем индикатор загрузки
    const loadingMessage: Message = {
      id: Date.now() + 1,
      text: 'Думаю...',
      isBot: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Подготавливаем историю сообщений для DeepSeek
      const deepSeekMessages: DeepSeekMessage[] = messages
        .filter(msg => !msg.isSuggestion && !msg.isError)
        .map(msg => ({
          role: msg.isBot ? 'assistant' : 'user',
          content: msg.text
        }));

      // Добавляем текущее сообщение пользователя
      deepSeekMessages.push({
        role: 'user',
        content: inputValue
      });

      // Получаем ответ от DeepSeek
      const aiResponse = await generateResponse(deepSeekMessages);

      // Убираем сообщение "Думаю..." и добавляем ответ
      setMessages(prev => 
        prev.filter(msg => msg.id !== loadingMessage.id).concat({
          id: Date.now() + 2,
          text: aiResponse,
          isBot: true,
          timestamp: new Date()
        })
      );
    } catch (err) {
      // Убираем сообщение "Думаю..." и показываем ошибку
      setMessages(prev => 
        prev.filter(msg => msg.id !== loadingMessage.id).concat({
          id: Date.now() + 2,
          text: 'Извините, не удалось получить ответ. Пожалуйста, попробуйте еще раз.',
          isBot: true,
          isError: true,
          timestamp: new Date()
        })
      );
    }
  };

  const handleQuickAction = async (action: QuickAction): Promise<void> => {
    const actionMessage: Message = {
      id: Date.now(),
      text: action,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, actionMessage]);

    // Показываем индикатор загрузки
    const loadingMessage: Message = {
      id: Date.now() + 1,
      text: 'Думаю...',
      isBot: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      let prompt = '';
      switch (action) {
        case 'Помощь':
          prompt = 'Помоги мне разобраться с текущим разделом приложения. Какие основные функции доступны?';
          break;
        case 'Что делать?':
          prompt = 'Что мне сделать сейчас в этом разделе? Дай конкретные рекомендации.';
          break;
        case 'Сохранить':
          prompt = 'Как правильно сохранить изменения в приложении?';
          break;
        case 'Отмена':
          prompt = 'Как отменить текущее действие?';
          break;
      }

      const deepSeekMessages: DeepSeekMessage[] = [
        {
          role: 'user',
          content: prompt
        }
      ];

      const aiResponse = await generateResponse(deepSeekMessages);

      setMessages(prev => 
        prev.filter(msg => msg.id !== loadingMessage.id).concat({
          id: Date.now() + 2,
          text: aiResponse,
          isBot: true,
          timestamp: new Date()
        })
      );
    } catch (err) {
      setMessages(prev => 
        prev.filter(msg => msg.id !== loadingMessage.id).concat({
          id: Date.now() + 2,
          text: 'Не удалось обработать запрос. Попробуйте еще раз.',
          isBot: true,
          isError: true,
          timestamp: new Date()
        })
      );
    }
  };

  return (
    <>
      {/* Плавающая кнопка */}
      {!isOpen && (
        <button 
          className="chat-bot-floating-btn"
          onClick={() => setIsOpen(true)}
          title="Открыть AI-помощника"
          type="button"
        >
          <span className="bot-icon">🤖</span>
          <span className="notification-dot"></span>
        </button>
      )}

      {/* Окно чата */}
      {isOpen && (
        <div className="chat-bot-container">
          <div className="chat-bot-header">
            <div className="bot-info">
              <span className="bot-avatar">AI</span>
              <div>
                <h3>DeepSeek Помощник</h3>
                <span className="status">
                  {isGenerating ? 'Печатает...' : 'В сети'}
                </span>
              </div>
            </div>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть чат"
              type="button"
            >
              ×
            </button>
          </div>

          <div className="chat-messages">
            {messages.map(message => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isBot={message.isBot}
                timestamp={message.timestamp}
                isSuggestion={message.isSuggestion}
                isError={message.isError}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Быстрые действия */}
          <div className="quick-actions">
            <button 
              onClick={() => handleQuickAction('Помощь')}
              type="button"
              disabled={isGenerating}
            >
              Помощь
            </button>
            <button 
              onClick={() => handleQuickAction('Что делать?')}
              type="button"
              disabled={isGenerating}
            >
              Что делать?
            </button>
            <button 
              onClick={() => handleQuickAction('Сохранить')}
              type="button"
              disabled={isGenerating}
            >
              Сохранить
            </button>
          </div>

          {/* Форма ввода */}
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              placeholder={isGenerating ? "AI генерирует ответ..." : "Задайте вопрос AI..."}
              className="chat-input"
              disabled={isGenerating}
            />
            <button 
              type="submit" 
              className="send-btn"
              disabled={!inputValue.trim() || isGenerating}
            >
              {isGenerating ? '⏳' : '→'}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;