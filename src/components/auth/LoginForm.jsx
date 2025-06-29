import React, { useState } from 'react';
import { login } from '../../services/authService';

const LoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      onSuccess();
    } catch (err) {
      // Handle specific Firebase errors
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/user-disabled':
          setError('Account disabled');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Try again later');
          break;
        default:
          setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Login to Your Account</h2>
      
      {error && (
        <div className="error-message">
          <span role="alert">{error}</span>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="login-email">Email Address</label>
        <input
          type="email"
          id="login-email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Password</label>
        <div className="password-input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            id="login-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            autoComplete="current-password"
            className="form-input"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="password-toggle"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={isLoading}
          className="submit-button"
        >
          {isLoading ? (
            <>
              <span className="spinner" aria-hidden="true"></span>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>
      </div>

      <div className="form-footer">
        <a href="/forgot-password" className="forgot-password">
          Forgot password?
        </a>
      </div>
    </form>
  );
};

export default LoginForm;