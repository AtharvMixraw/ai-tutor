import React from "react";
import './Header.css'; 
const Header = ({onClearChat,hasMessages}) => {
    return (
        <div className="header">
            <h1 className="header-title">AI Tutor</h1>
            <button onClick={onClearChat} className="clear-button" disabled={!hasMessages}>
                Clear Chat
            </button>
        </div>
    );
};

export default Header;