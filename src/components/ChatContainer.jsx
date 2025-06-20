import React, { use, useEffect, useRef} from "react";
import MessageBubble from "./MessageBubble";
import LoadingIndicator from "./LoadingIndicator";
import EmptyState from "./EmptyState";

const ChatContainer = ({ messages, isLoading, onCopyMessage }) => {
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
                    messages.map((message) =>(
                        <MessageBubble
                            key = {message.id}
                            message={message}
                            onCopyMessage={onCopyMessage}
                        />
                    ))
                )
            }
            {isLoading && <LoadingIndicator />}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatContainer;