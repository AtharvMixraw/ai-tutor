import React from 'react';
import './LoaderScreen.css';

const LoaderScreen = ({ message = "Initializing your application..." }) => {
    return (
        <div className="loader-screen">
            <div className="loader-animation">
                <div className="loader-dot"></div>
                <div className="loader-dot"></div>
                <div className="loader-dot"></div>
                <div className="loader-dot"></div>
            </div>
            <div className="loader-text">{message}</div>
            <div className="loader-subtext">This will only take a moment</div>
        </div>
    );
};

export default LoaderScreen;