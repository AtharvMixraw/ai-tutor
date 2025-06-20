import React from 'react';
import './LoadingIndicator.css';

const LoadingIndicator = () => {
  return (
    <div className="loading-wrapper">
      <div className="loading-bubble">
        <div className="dot dot-1"></div>
        <div className="dot dot-2"></div>
        <div className="dot dot-3"></div>
        <span className="loading-text">AI is thinking...</span>
      </div>
    </div>
  );
};

export default LoadingIndicator;