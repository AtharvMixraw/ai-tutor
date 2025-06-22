import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import './LoaderScreen.css';

const LoaderScreen = ({ message = "Initializing your AI Tutor..." }) => {
    return (
        <div className="loader-screen">
            <ClipLoader color="#4cc9f0" size={80} speedMultiplier={1.2} />
            <div className="loader-text">{message}</div>
            <div className="loader-subtext">Please wait while we set things up...</div>
        </div>
    );
};

export default LoaderScreen;
