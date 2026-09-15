import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import AuthLayout from './auth/AuthLayout';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(login({ username, password }));
    if (login.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout
      mode="login"
      heroBadge="KNOWLEDGE GRAPH"
      heroTitleLine1="NETWORK GRAPHS &"
      heroTitleHighlight="KNOWLEDGE"
      heroTitleLine2="BASES."
      heroDescription="Organize complex information, map interconnected data, and visualize knowledge graphs with MindMesh."
      cardTag="GRAPH OVERVIEW"
      metric1Value="1,240+"
      metric1Label="CONNECTED NODES"
      metric2Value="98.6%"
      metric2Label="SEMANTIC RELEVANCE"
      cardFooter="INTERACTIVE CANVAS • REAL-TIME SYNC"
      specs={[
        { key: 'PLATFORM', val: 'MINDMESH' },
        { key: 'WORKSPACE', val: 'GRAPHS & NODES' },
        { key: 'VERSION', val: '2.0' },
      ]}
    >
      {/* FORM HEADER */}
      <div className="y2k-terminal-badge-row">
        <div className="y2k-terminal-badge">
          <span className="y2k-pulse-dot" />
          <span>ACCOUNT LOGIN</span>
        </div>
        <span className="y2k-terminal-index">01 / 02</span>
      </div>

      <h2 className="y2k-form-title">Log In</h2>
      <p className="y2k-form-subtitle">
        Enter your credentials to access your network graphs.
      </p>

      {/* SUCCESS MESSAGE */}
      {location.state?.message && (
        <div className="y2k-success-box">
          <div className="y2k-success-tag">Success</div>
          <div>{location.state.message}</div>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="y2k-alert-box">
          <div className="y2k-alert-tag">Login Error</div>
          <div>{typeof error === 'string' ? error : error?.message || 'Login failed. Please check your credentials.'}</div>
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="y2k-form">
        <div className="y2k-field-group">
          <div className="y2k-label-row">
            <label htmlFor="username" className="y2k-label">
              Username
            </label>
          </div>
          <div className="y2k-input-wrapper">
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="MindMesh Username"
              className="y2k-input"
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div className="y2k-field-group">
          <div className="y2k-label-row">
            <label htmlFor="password" className="y2k-label">
              Password
            </label>
          </div>
          <div className="y2k-input-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="y2k-input"
              autoComplete="current-password"
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

        <button
          type="submit"
          disabled={isLoading}
          className="y2k-btn-primary"
        >
          <span>{isLoading ? 'Logging in...' : 'Log In'}</span>
          <span className="y2k-btn-arrow">↗</span>
        </button>

        <div className="y2k-switch-row">
          <span className="y2k-switch-text">Don't have an account?</span>
          <Link to="/register" className="y2k-switch-link">
            <span>Create an account</span>
            <span>↗</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
