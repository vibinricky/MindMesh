import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import ErrorHandler from './ErrorHandler';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
    <div style={{ maxWidth: '600px', margin: '4rem 4rem' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '2rem' }}>Login to MindMesh</h2>
      {location.state?.message && <p style={{ color: '#10b981', marginBottom: '1rem' }}>{location.state.message}</p>}
      <ErrorHandler error={error ? { message: error } : null} />
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>Username</label>
          <input 
            id="username"
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="MindMesh Username"
            style={{ width: '100%', padding: '0.75rem', border: 'none', borderBottom: '1px solid #d1d5db', borderRadius: '0', backgroundColor: 'transparent', boxShadow: 'none' }}
            required
          />
        </div>
        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>Password</label>
          <input 
            id="password"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter Password"
            style={{ width: '100%', padding: '0.75rem', border: 'none', borderBottom: '1px solid #d1d5db', borderRadius: '0', backgroundColor: 'transparent', boxShadow: 'none' }}
            required
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <button type="submit" disabled={isLoading} style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 2rem', border: 'none', borderRadius: '0.375rem', fontWeight: 500, cursor: 'pointer' }}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Don't have an account? <Link to="/register" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 500 }}>Register here</Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
