import React from 'react';
import './styles.css';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: Date;
  isSuggestion?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isBot, 
  timestamp, 
  isSuggestion = false 
}) => {
  return (
    <div className={`chat-message ${isBot ? 'bot-message' : 'user-message'}`}>
      <div className="message-avatar">
        {isBot ? '🤖' : '👤'}
      </div>
      <div className="message-content">
        <div className={`message-text ${isSuggestion ? 'suggestion-message' : ''}`}>
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