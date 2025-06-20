import React, { useRef, useState, useEffect } from 'react';
import Header from './components/Header';
import ChatContainer from './components/ChatContainer';
import InputArea from './components/InputArea';
import LoaderScreen from './components/LoaderScreen';
import { sendMessageToAI } from './services/aiService';
import './App.css';

const App = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true); // New state for initial load

    const inputRef = useRef(null);

    useEffect(() => {
        // Simulate app initialization (replace with actual setup if needed)
        const timer = setTimeout(() => {
            setIsInitializing(false);
        }, 3000); // 3-second splash screen

        return () => clearTimeout(timer);
    }, []);

    const handleSendMessage = async (input) => {
        if (input.trim() === '' || isLoading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const aiResponse = await sendMessageToAI(input);

            const aiMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: aiResponse,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error(err);
            const errorMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: 'Error contacting AI model. Is Ollama running?',
                timestamp: new Date(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        }

        setIsLoading(false);
    };

    const clearChat = () => {
        if (window.confirm('Clear chat history?')) {
            setMessages([]);
            setIsLoading(false);
            inputRef.current?.clear();
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    };

    const copyMessage = (content) => {
        navigator.clipboard.writeText(content).then(() => {
            console.log('Message copied to clipboard');
        });
    };
    console.log("Current loading state:", isLoading);
    return (
        <div className="app">
            {isInitializing && <LoaderScreen message="Initializing App..." />}
            
            {!isInitializing && (
                <>
                    <Header onClearChat={clearChat} hasMessages={messages.length > 0} />
                    <ChatContainer messages={messages} isLoading={isLoading} onCopyMessage={copyMessage}/>
                    <InputArea
                        ref={inputRef}
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                        hasMessages={messages.length > 0}
                    />
                </>
            )}
        </div>
    );
};

export default App;