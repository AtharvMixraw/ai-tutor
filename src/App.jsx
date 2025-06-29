import React, { useRef, useState, useEffect } from 'react';
import Header from './components/Header';
import ChatContainer from './components/ChatContainer';
import InputArea from './components/InputArea';
import LoaderScreen from './components/LoaderScreen';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignUpForm';

import { sendMessageToAI } from './services/aiService';
import { onAuthChange, saveChat, loadChat, logout } from './services/authService';

import './App.css';

const App = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [user, setUser] = useState(null);
    const [showSignup, setShowSignup] = useState(false);

    const inputRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitializing(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Listen for login/logout
        onAuthChange(async (u) => {
            setUser(u);
            if (u) {
                const chatHistory = await loadChat(u.uid);
                setMessages(chatHistory || []);
            } else {
                setMessages([]);
            }
        });
    }, []);

    const handleSendMessage = async (input) => {
        if (input.trim() === '' || isLoading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => {
            const updated = [...prev, userMessage];
            if (user) saveChat(user.uid, updated);
            return updated;
        });

        setIsLoading(true);

        try {
            const aiResponse = await sendMessageToAI(input);

            const aiMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: aiResponse,
                timestamp: new Date()
            };

            setMessages(prev => {
                const updated = [...prev, aiMessage];
                if (user) saveChat(user.uid, updated);
                return updated;
            });
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
            if (user) saveChat(user.uid, []);
            inputRef.current?.clear();
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    };

    const copyMessage = (content) => {
        navigator.clipboard.writeText(content).then(() => {
            console.log('Message copied to clipboard');
        });
    };

    if (isInitializing) {
        return <LoaderScreen message="Initializing App..." />;
    }

    if (!user) {
        return (
            <div className="auth-wrapper">
                {showSignup ? (
                    <>
                        <SignupForm onSuccess={() => setShowSignup(false)} />
                        <p>Already have an account? <button onClick={() => setShowSignup(false)}>Login</button></p>
                    </>
                ) : (
                    <>
                        <LoginForm onSuccess={() => {}} />
                        <p>No account? <button onClick={() => setShowSignup(true)}>Sign up</button></p>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="app">
            <Header onClearChat={clearChat} hasMessages={messages.length > 0} />
            <button onClick={logout} className="logout-btn">Logout</button>
            <ChatContainer messages={messages} isLoading={isLoading} onCopyMessage={copyMessage} />
            <InputArea
                ref={inputRef}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                hasMessages={messages.length > 0}
            />
        </div>
    );
};

export default App;
