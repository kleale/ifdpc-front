import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { useContextSuggestions } from '../../hooks/useContextSuggestions';
import ChatMessage from './ChatMessage';
import { Message, QuickAction } from '../../types';
import './styles.css';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Здравствуйте! Я ваш контекстный помощник. Подскажу, какие действия доступны в текущем разделе.',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const suggestions = useContextSuggestions();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Автоматически добавляем контекстные подсказки при изменении контекста
  useEffect(() => {
    if (isOpen && suggestions.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      // Добавляем подсказку только если предыдущее сообщение не было подсказкой
      if (!lastMessage.isSuggestion) {
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
  }, [suggestions, isOpen, messages]);

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('помощь') || input.includes('help')) {
      return `Конечно! Сейчас вы находитесь в разделе, где можете: ${suggestions.join(' ')}`;
    }
    
    if (input.includes('что делать') || input.includes('что можно')) {
      return `На основе текущего контекста рекомендую: ${suggestions[0] || 'исследовать доступные функции'}`;
    }
    
    if (input.includes('настройки') || input.includes('settings')) {
      return 'Перейдите в раздел настроек для управления параметрами системы. Там вы можете настроить уведомления, безопасность и внешний вид.';
    }
    
    return `Понял ваш вопрос! ${suggestions.length > 0 ? `Сейчас самое время: ${suggestions[0]}` : 'Продолжайте работу, я здесь чтобы помочь.'}`;
  };

  const handleSendMessage = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Добавляем сообщение пользователя
    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Имитируем задержку ответа
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: getBotResponse(inputValue),
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleQuickAction = (action: QuickAction): void => {
    const actionMessage: Message = {
      id: Date.now(),
      text: action,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, actionMessage]);

    setTimeout(() => {
      const responses: Record<QuickAction, string> = {
        'Помощь': `Чем могу помочь? Сейчас доступны действия: ${suggestions.slice(0, 2).join(', ')}`,
        'Что делать?': `Рекомендую: ${suggestions[0] || 'ознакомиться с возможностями системы'}`,
        'Сохранить': 'Изменения сохранены. Продолжайте работу!',
        'Отмена': 'Действие отменено. Что бы вы хотели сделать вместо этого?'
      };
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text: responses[action],
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 800);
  };

  return (
    <>
      {/* Плавающая кнопка */}
      {!isOpen && (
        <button 
          className="chat-bot-floating-btn"
          onClick={() => setIsOpen(true)}
          title="Открыть помощника"
          type="button"
        >
          <span className="bot-icon">💬</span>
          <span className="notification-dot"></span>
        </button>
      )}

      {/* Окно чата */}
      {isOpen && (
        <div className="chat-bot-container">
          <div className="chat-bot-header">
            <div className="bot-info">
              <span className="bot-avatar">🤖</span>
              <div>
                <h3>Контекстный помощник</h3>
                <span className="status">В сети</span>
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
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Быстрые действия */}
          <div className="quick-actions">
            <button 
              onClick={() => handleQuickAction('Помощь')}
              type="button"
            >
              Помощь
            </button>
            <button 
              onClick={() => handleQuickAction('Что делать?')}
              type="button"
            >
              Что делать?
            </button>
            <button 
              onClick={() => handleQuickAction('Сохранить')}
              type="button"
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
              placeholder="Введите ваш вопрос..."
              className="chat-input"
            />
            <button 
              type="submit" 
              className="send-btn"
              disabled={!inputValue.trim()}
            >
              →
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;