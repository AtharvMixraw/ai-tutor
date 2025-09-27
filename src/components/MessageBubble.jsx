import React from 'react';
import './MessageBubble.css';

const MessageBubble = ({ message, onCopyMessage, showTypingCursor = false }) => {
  const handleCopy = () => {
    if (onCopyMessage) {
      onCopyMessage(message.content);
    }
  };

  return (
    <div className={`message-bubble ${message.role}`}>
      <div className="message-content">
        <div className="message-text">
          {message.content}
          {/* Show blinking cursor while streaming */}
          {showTypingCursor && (
            <span className="typing-cursor">|</span>
          )}
        </div>
        {message.role === 'assistant' && message.content && (
          <button 
            className="copy-button" 
            onClick={handleCopy}
            title="Copy message"
          >
            📋
          </button>
        )}
      </div>
      <div className="message-timestamp">
        {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ''}
      </div>
    </div>
  );
};

export default MessageBubble;