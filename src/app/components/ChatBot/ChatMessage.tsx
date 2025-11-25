import React from 'react';
import './ChatBot.css';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: Date;
  isSuggestion?: boolean;
  isError?: boolean;
  buttons?: Array<{
    id: string;
    text: string;
    action?: string;
    type?: 'primary' | 'secondary' | 'danger';
  }>;
  onButtonClick?: (button: { id: string; text: string; action?: string }) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isBot,
  timestamp,
  isSuggestion = false,
  isError = false,
  buttons = [],
  onButtonClick
}) => {
  const getAvatar = () => {
    if (isError) return '⚠️';
    return isBot ? '🤖' : '👤';
  };

  const getMessageClass = () => {
    const classes = ['chat-message'];
    if (isBot) classes.push('bot-message');
    if (isError) classes.push('error-message');
    if (isSuggestion) classes.push('suggestion-message');
    if (buttons.length > 0) classes.push('has-buttons');
    return classes.join(' ');
  };

  const getBubbleClass = () => {
    const classes = ['message-bubble'];
    if (isSuggestion) classes.push('suggestion-bubble');
    if (isError) classes.push('error-bubble');
    return classes.join(' ');
  };

    const handleButtonClick = (button: { id: string; text: string; action?: string }) => {
    if (onButtonClick) {
      onButtonClick(button);
    }
  };

  return (
    <div className={getMessageClass()}>
      {/* <div className="message-avatar">
        {getAvatar()}
      </div> */}
      
      <div className="message-content">
        <div className={getBubbleClass()}>
          <div className="message-text">{message}</div>
          
          {buttons.length > 0 && (
            <div className="message-buttons">
              {buttons.map((button) => (
                <button
                  key={button.id}
                  className={`message-button message-button--${button.type || 'secondary'}`}
                  onClick={() => handleButtonClick(button)}
                  type="button"
                >
                  {button.text}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="message-time">
          {timestamp.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
};