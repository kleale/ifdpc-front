import React from 'react';
import './styles.css';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: Date;
  isSuggestion?: boolean;
  isError?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isBot, 
  timestamp, 
  isSuggestion = false,
  isError = false
}) => {
  return (
    <div className={`chat-message ${isBot ? 'bot-message' : 'user-message'}`}>
      <div className="message-avatar">
        {isBot ? (isError ? '⚠️' : '🤖') : '👤'}
      </div>
      <div className="message-content">
        <div className={`message-text ${isSuggestion ? 'suggestion-message' : ''} ${isError ? 'error-message' : ''}`}>
          {message}
        </div>
        {timestamp && (
          <div className="message-time">
            {timestamp.toLocaleTimeString('ru-RU', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;