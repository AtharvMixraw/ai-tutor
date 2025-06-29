import React, { useState } from 'react';
import { signup } from '../../services/authService';

const SignupForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      setIsLoading(true);
      await signup(email, password);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Account</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      
      <div>
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email"
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input 
          type="password" 
          id="password"
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          minLength="6"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input 
          type="password" 
          id="confirmPassword"
          placeholder="Confirm Password" 
          value={confirmPassword} 
          onChange={e => setConfirmPassword(e.target.value)} 
          required 
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignupForm;