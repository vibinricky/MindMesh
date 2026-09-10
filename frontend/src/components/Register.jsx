import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerService } from '../services/authService';
import AuthLayout from './auth/AuthLayout';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_ANALYST');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await registerService({ username, password, role });
      navigate('/login', { state: { message: 'Registration complete. Please log in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      mode="register"
      heroBadge="CREATE ACCOUNT"
      heroTitleLine1="BUILD & EXPLORE"
      heroTitleHighlight="NETWORK"
      heroTitleLine2="GRAPHS."
      heroDescription="Collaborate on network graphs, explore semantic search, and manage your structured knowledge base."
      cardTag="WORKSPACE OVERVIEW"
      metric1Value="UNLIMITED"
      metric1Label="GRAPH CANVAS NODES"
      metric2Value="REAL-TIME"
      metric2Label="GRAPH SYNCHRONIZATION"
      cardFooter="KNOWLEDGE BASE MANAGEMENT"
      specs={[
        { key: 'PLATFORM', val: 'MINDMESH' },
        { key: 'ROLE ACCESS', val: 'ANALYST / STRATEGIST' },
        { key: 'VERSION', val: '2.0' },
      ]}
    >
      {/* FORM HEADER */}
      <div className="y2k-terminal-badge-row">
        <div className="y2k-terminal-badge">
          <span className="y2k-pulse-dot" />
          <span>NEW ACCOUNT</span>
        </div>
        <span className="y2k-terminal-index">02 / 02</span>
      </div>

      <h2 className="y2k-form-title">Create Account</h2>
      <p className="y2k-form-subtitle">
        Sign up to start organizing and exploring knowledge graphs.
      </p>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="y2k-alert-box">
          <div className="y2k-alert-tag">Registration Error</div>
          <div>{typeof error === 'string' ? error : error?.message || 'Registration failed. Please check your inputs.'}</div>
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="y2k-form">
        <div className="y2k-field-group">
          <div className="y2k-label-row">
            <label htmlFor="reg-username" className="y2k-label">
              Username
            </label>
          </div>
          <div className="y2k-input-wrapper">
            <input
              id="reg-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="y2k-input"
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div className="y2k-field-group">
          <div className="y2k-label-row">
            <label htmlFor="reg-email" className="y2k-label">
              Email Address
            </label>
          </div>
          <div className="y2k-input-wrapper">
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="y2k-input"
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="y2k-field-group">
          <div className="y2k-label-row">
            <label htmlFor="reg-password" className="y2k-label">
              Password
            </label>
          </div>
          <div className="y2k-input-wrapper">
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="y2k-input"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="y2k-toggle-pwd"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="y2k-field-group">
          <div className="y2k-label-row">
            <label htmlFor="reg-role" className="y2k-label">
              Domain Role
            </label>
          </div>
          <div className="y2k-input-wrapper">
            <select
              id="reg-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="y2k-select"
            >
              <option value="ROLE_ANALYST">Analyst</option>
              <option value="ROLE_RESEARCH_STRATEGIST">Research Strategist</option>
            </select>
            <span className="y2k-select-arrow">▼</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="y2k-btn-primary"
        >
          <span>{isLoading ? 'Creating account...' : 'Create Account'}</span>
          <span className="y2k-btn-arrow">↗</span>
        </button>

        <div className="y2k-switch-row">
          <span className="y2k-switch-text">Already have an account?</span>
          <Link to="/login" className="y2k-switch-link">
            <span>Log in here</span>
            <span>↗</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
