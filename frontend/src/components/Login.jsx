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
    <div className="card" style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login to MindMesh</h2>
      {location.state?.message && <p style={{ color: '#10b981', textAlign: 'center' }}>{location.state.message}</p>}
      <ErrorHandler error={error ? { message: error } : null} />
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>MindMesh Username</label>
          <input 
            id="username"
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="MindMesh Username"
            required
          />
        </div>
        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
          <input 
            id="password"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter Password"
            required
          />
        </div>
        <button type="submit" className="primary mt-4" disabled={isLoading} style={{ width: '100%', padding: '0.75rem' }}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <Link to="/register">Register a new account</Link>
      </div>
    </div>
  );
};

export default Login;
