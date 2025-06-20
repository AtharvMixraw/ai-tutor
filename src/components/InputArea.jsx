import React , {useState,useRef} from 'react';
import './InputArea.css';

const InputArea = ({onSendMessage,isLoading}) => {
    const [input,setInput] = useState('');
    const textareaRef = useRef(null);

    const handleInputChange = (e) => {
        setInput(e.target.value);
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight,120) + 'px'
    };

    const handleSend = () => {
        if(input.trim() === '' || isLoading) return ;

        onSendMessage(input);
        setInput('');

        if(textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyPress = (e) => {
        if(e.key === 'Enter' && !e.shiftKey){
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
              placeholder="Ask your question... (Press Enter to send, Shift+Enter for new line)"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className={`input-textarea ${isLoading ? 'disabled' : ''}`}
            />
            
            <button
              onClick={handleSend}
              disabled={input.trim() === '' || isLoading}
              className={`send-button ${(input.trim() === '' || isLoading) ? 'disabled' : ''}`}
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </div>
        </div>
    );
};

export default InputArea;