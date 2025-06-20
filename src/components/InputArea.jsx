import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import './InputArea.css';

const InputArea = forwardRef(({ onSendMessage, isLoading, hasMessages }, ref) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef(null);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
        focus: () => {
            textareaRef.current?.focus();
        },
        clear: () => {
            setInput('');
            textareaRef.current.style.height = 'auto';
        }
    }));

    // Auto-focus when messages change or component mounts
    useEffect(() => {
        textareaRef.current?.focus();
    }, [hasMessages]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    };

    const handleSend = () => {
        if (input.trim() === '' || isLoading) return;
        onSendMessage(input);
        setInput('');
        textareaRef.current.style.height = 'auto';
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="input-area">
            <div className="input-container">
                <textarea
                    ref={textareaRef}
                    rows="1"
                    placeholder="Ask your question..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    className="input-textarea"
                    autoFocus
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading}
                    className={`send-button ${isLoading ? 'disabled' : ''}`}
                >
                    {isLoading ? '...' : 'Send'}
                </button>
            </div>
        </div>
    );
});

export default InputArea;