import React, { useState, useRef, useEffect } from 'react';
import './SignupForm.css'; // You can reuse SignupForm.css if styles are same
import gsap from 'gsap';
import { login } from '../../services/authService';

const LoginForm = ({ onSuccess, toggleAuthMode }) => {
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    gsap.from(leftPanelRef.current, {
      x: -100,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    });

    gsap.from(rightPanelRef.current, {
      x: 100,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power2.out',
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      onSuccess?.();
    } catch (err) {
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

      gsap.fromTo(
        '.error',
        { x: -10 },
        { x: 10, duration: 0.1, repeat: 3, yoyo: true }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signup-container"> {/* Reuse same CSS class */}
      <div className="left-panel" ref={leftPanelRef}>
        <div className="overlay">
          <h4>AI TUTOR</h4>
          <h2>Offline-first, AI-powered learning.</h2>
          <p>
            Learn anything, anytime — even without internet.
            <br />
            Experience the power of LLMs tailored for real-world teaching.
          </p>
          <span>
            New here?{' '}
            <a href="#" onClick={(e) => {
              e.preventDefault();
              toggleAuthMode();
            }}>
              Sign up
            </a>
          </span>
        </div>
      </div>

      <div className="right-panel" ref={rightPanelRef}>
        <form onSubmit={handleSubmit} className="form">
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}

          <label htmlFor="login-email">Email address</label>
          <input
            type="email"
            id="login-email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

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

          <div className="form-footer">
            <a href="/forgot-password" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
