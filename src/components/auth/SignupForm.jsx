import React, { useState, useEffect, useRef } from 'react';
import './SignupForm.css';
import gsap from 'gsap';
import { signup } from '../../services/authService';

const SignupForm = ({ onSuccess, toggleAuthMode }) => {
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // GSAP animations on mount
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

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      gsap.fromTo(
        '.error',
        { x: -10 },
        { x: 10, duration: 0.1, repeat: 3, yoyo: true }
      );
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await signup(email, password);
      onSuccess?.();
    } catch (err) {
      const msg =
        err?.code === 'auth/email-already-in-use'
          ? 'Email already in use'
          : err.message || 'Signup failed. Please try again.';
      setError(msg);
      gsap.fromTo(
        '.error',
        { x: -10 },
        { x: 10, duration: 0.1, repeat: 3, yoyo: true }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
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
            Already using AI Tutor?{' '}
            <a href="#" onClick={(e) => {
              e.preventDefault();
              toggleAuthMode?.(); // Switch to LoginForm
            }}>
              Sign in
            </a>
          </span>
        </div>
      </div>

      <div className="right-panel" ref={rightPanelRef}>
        <form onSubmit={handleSubmit} className="form">
          <h2>Sign up</h2>
          {error && <p className="error">{error}</p>}

          <label htmlFor="signup-email">Email address</label>
          <input
            type="email"
            id="signup-email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="signup-password">Set password</label>
          <input
            type="password"
            id="signup-password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="signup-confirm">Confirm password</label>
          <input
            type="password"
            id="signup-confirm"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign up →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
