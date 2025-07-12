import React, { useState } from 'react';
import { resetPassword } from '../../services/authService';
import './SignupForm.css'; // optional reuse of styles

const ForgotPasswordForm = ({ goBack }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword(email);
      setMessage('Password reset email sent. Please check your inbox.');
    } catch (err) {
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        default:
          setError('Failed to send reset email. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="right-panel">
        <form onSubmit={handleReset} className="form">
          <h2>Reset Password</h2>
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <label htmlFor="reset-email">Email address</label>
          <input
            type="email"
            id="reset-email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <button type="button" className="back-button" onClick={goBack}>
            ← Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
