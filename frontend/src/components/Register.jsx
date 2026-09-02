import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerService } from '../services/authService';
import ErrorHandler from './ErrorHandler';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_ANALYST');
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
    <div style={{ maxWidth: '600px', margin: '4rem 4rem' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '2rem' }}>Join MindMesh</h2>
      <ErrorHandler error={error ? { message: error } : null} />
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>Username</label>
          <input 
            id="username"
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={{ width: '100%', padding: '0.75rem', border: 'none', borderBottom: '1px solid #d1d5db', borderRadius: '0', backgroundColor: 'transparent', boxShadow: 'none' }}
            required
          />
        </div>
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>Email Address</label>
          <input 
            id="email"
            type="email" 
            placeholder="you@example.com"
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
            style={{ width: '100%', padding: '0.75rem', border: 'none', borderBottom: '1px solid #d1d5db', borderRadius: '0', backgroundColor: 'transparent', boxShadow: 'none' }}
            required
          />
        </div>
        <div>
          <label htmlFor="role" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>Domain Role</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: 'none', borderBottom: '1px solid #d1d5db', borderRadius: '0', backgroundColor: 'transparent', boxShadow: 'none', color: '#6b7280' }}>
            <option value="ROLE_ANALYST">-- Select Your Professional Role --</option>
            <option value="ROLE_RESEARCH_STRATEGIST">Research Strategist</option>
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <button type="submit" disabled={isLoading} style={{ backgroundColor: '#1d4ed8', color: 'white', padding: '0.5rem 2rem', border: 'none', borderRadius: '0.375rem', fontWeight: 500, cursor: 'pointer' }}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Already have an account? <Link to="/login" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 500 }}>Login here</Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Register;
