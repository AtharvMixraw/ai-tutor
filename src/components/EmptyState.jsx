import React from "react";
import './EmptyState.css';

const EmptyState = () => {
    return (
        <div className="empty-state">
            <p className="welcome-title">Welcome to AI Tutor! 🎓</p>
            <p className="welcome-subtitle">Ask me anything to get started.</p>
        </div>
    );
};

export default EmptyState;