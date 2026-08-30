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
    <div className="card" style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Join MindMesh</h2>
      <ErrorHandler error={error ? { message: error } : null} />
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Username</label>
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
        <div>
          <label htmlFor="role" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Role</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="ROLE_ANALYST">Analyst (Read-only)</option>
            <option value="ROLE_RESEARCH_STRATEGIST">Research Strategist (Full Access)</option>
          </select>
        </div>
        <button type="submit" className="primary mt-4" disabled={isLoading} style={{ width: '100%', padding: '0.75rem' }}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <Link to="/login">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default Register;
