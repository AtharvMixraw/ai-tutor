import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import LoadingIndicator from "./LoadingIndicator";
import EmptyState from "./EmptyState";

const ChatContainer = ({ messages, isLoading, isStreaming, onCopyMessage }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="chat-container">
            {
                messages.length === 0 ? (
                    <EmptyState/>
                ) : (
                    messages.map((message, index) => (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            onCopyMessage={onCopyMessage}
                            // Show typing cursor for the last assistant message while streaming
                            showTypingCursor={
                                isStreaming && 
                                message.role === 'assistant' && 
                                index === messages.length - 1
                            }
                        />
                    ))
                )
            }
            {isLoading && !isStreaming && <LoadingIndicator />}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatContainer;