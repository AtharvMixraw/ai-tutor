import React from "react";
import { formatTime } from '../utils/dateUtils';
import './MessageBubble.css';

const MessageBubble = ({ message, onCopyMessage }) => {
    const { type, content, timestamp, isError } = message;

    return (
        <div className={`message-wrapper ${type}`}>
            <div className="message-content">
                <div className={`message-bubble ${type} ${isError ? 'error' : ''}`}>
                    {content}
                    {type === 'ai' && !isError && (
                        <button
                            onClick={() => onCopyMessage(content)}
                            className="copy-button"
                            title="Copy message"
                        >
                            📋
                        </button>
                    )}
                </div>
                <div className={`timestamp ${type}`}>
                    {formatTime(timestamp)}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;