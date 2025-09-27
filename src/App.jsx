import React, { useRef, useState, useEffect } from 'react';
import Header from './components/Header';
import ChatContainer from './components/ChatContainer';
import InputArea from './components/InputArea';
import LoaderScreen from './components/LoaderScreen';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignUpForm';

import { sendMessageToAI, sendMessageToAIStreaming } from './services/aiService';
import { onAuthChange, saveChat, loadChat, logout } from './services/authService';

import './App.css';

const App = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
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
        if (input.trim() === '' || isLoading || isStreaming) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            role: 'user', // Add role for compatibility with MessageBubble
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => {
            const updated = [...prev, userMessage];
            if (user) saveChat(user.uid, updated);
            return updated;
        });

        setIsLoading(true);

        // Add empty AI message that will be updated during streaming
        const aiMessage = {
            id: Date.now() + 1,
            type: 'ai',
            role: 'assistant', // Add role for compatibility with MessageBubble
            content: '',
            timestamp: new Date()
        };

        setMessages(prev => {
            const updated = [...prev, aiMessage];
            return updated;
        });

        try {
            // Start streaming
            setIsStreaming(true);
            setIsLoading(false); // We're no longer "loading", we're "streaming"

            await sendMessageToAIStreaming(
                input,
                // onChunk callback - called for each chunk received
                (chunk, fullResponse) => {
                    setMessages(prev => {
                        const newMessages = [...prev];
                        const lastMessageIndex = newMessages.length - 1;
                        newMessages[lastMessageIndex] = {
                            ...newMessages[lastMessageIndex],
                            content: fullResponse
                        };
                        return newMessages;
                    });
                },
                // onComplete callback - called when streaming is done
                (fullResponse) => {
                    setIsStreaming(false);
                    
                    // Save the complete chat history
                    setMessages(prev => {
                        const finalMessages = [...prev];
                        if (user) saveChat(user.uid, finalMessages);
                        return finalMessages;
                    });
                    
                    // Focus back to input after response is complete
                    setTimeout(() => {
                        inputRef.current?.focus();
                    }, 100);
                },
                // onError callback - called if there's an error
                (error) => {
                    setIsStreaming(false);
                    
                    // Update the AI message with error
                    setMessages(prev => {
                        const newMessages = [...prev];
                        const lastMessageIndex = newMessages.length - 1;
                        newMessages[lastMessageIndex] = {
                            ...newMessages[lastMessageIndex],
                            content: 'Error contacting AI model. Is Ollama running?',
                            isError: true
                        };
                        
                        if (user) saveChat(user.uid, newMessages);
                        return newMessages;
                    });
                    
                    // Focus back to input on error
                    setTimeout(() => {
                        inputRef.current?.focus();
                    }, 100);
                }
            );
        } catch (err) {
            console.error(err);
            setIsStreaming(false);
            setIsLoading(false);
            
            // Update the AI message with error
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMessageIndex = newMessages.length - 1;
                newMessages[lastMessageIndex] = {
                    ...newMessages[lastMessageIndex],
                    content: 'Error contacting AI model. Is Ollama running?',
                    isError: true
                };
                
                if (user) saveChat(user.uid, newMessages);
                return newMessages;
            });
        }
    };

    const clearChat = () => {
        if (window.confirm('Clear chat history?')) {
            setMessages([]);
            setIsLoading(false);
            setIsStreaming(false);
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
                        <SignupForm 
                            onSuccess={() => setShowSignup(false)} 
                            toggleAuthMode={() => setShowSignup(false)}
                        />
                    </>
                ) : (
                    <>
                        <LoginForm
                            onSuccess={() => {}}
                            toggleAuthMode={() => setShowSignup(true)}
                        />
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="app">
            <Header 
                onClearChat={clearChat} 
                hasMessages={messages.length > 0}
                isStreaming={isStreaming}
            />
            <button onClick={logout} className="logout-btn">Logout</button>
            <ChatContainer 
                messages={messages} 
                isLoading={isLoading}
                isStreaming={isStreaming}
                onCopyMessage={copyMessage} 
            />
            <InputArea
                ref={inputRef}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                isStreaming={isStreaming}
                hasMessages={messages.length > 0}
            />  
        </div>
    );
};

export default App;