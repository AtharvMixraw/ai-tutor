import React from 'react';
import './Header.css';

const Header = ({ onClearChat, hasMessages, isStreaming }) => {
  const getStatusText = () => {
    if (isStreaming) return 'AI is responding...';
    return 'Ready';
  };

  const getStatusClass = () => {
    if (isStreaming) return 'streaming';
    return 'ready';
  };

  return (
    <header className={`header ${isStreaming ? 'streaming' : ''}`}>
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">AI Tutor</h1>
          <div className={`status-indicator ${getStatusClass()}`}>
            {isStreaming && <span className="streaming-dot"></span>}
            <span className="status-text">{getStatusText()}</span>
          </div>
        </div>
        
        <div className="header-actions">
          {hasMessages && (
            <button 
              onClick={onClearChat} 
              className="clear-btn"
              disabled={isStreaming}
              title={isStreaming ? 'Cannot clear while AI is responding' : 'Clear chat history'}
            >
              Clear Chat
            </button>
          )}
        </div>
      </div>
      
      {/* Streaming progress bar */}
      {isStreaming && (
        <div className="streaming-progress">
          <div className="streaming-bar"></div>
        </div>
      )}
    </header>
  );
};

export default Header;