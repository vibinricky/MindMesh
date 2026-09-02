import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar" style={{ backgroundColor: '#111827', color: 'white', display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ color: '#3b82f6', fontSize: '1.25rem', fontWeight: 'bold' }}>MindMesh</div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/dashboard" style={{ color: '#f3f4f6', textDecoration: 'none', fontSize: '0.9rem' }}>Dashboard</Link>
          {(user?.role === 'ROLE_RESEARCH_STRATEGIST' || user?.role === 'RESEARCH_STRATEGIST') ? (
            <>
              <Link to="/my-graphs" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Workspace</Link>
              <Link to="/search" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Semantic Search</Link>
            </>
          ) : (
            <>
              <Link to="/activity" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>System Health</Link>
              <Link to="/metrics" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Global Metrics</Link>
            </>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem' }}>
        <span style={{ border: '1px solid #1e3a8a', padding: '0.25rem 0.75rem', borderRadius: '9999px', color: '#60a5fa', fontWeight: '600', letterSpacing: '0.05em' }}>
          {user?.role ? user.role.replace('ROLE_', '').replace('_', ' ') : 'KNOWLEDGE ARCHITECT'}
        </span>
        <span style={{ color: '#6b7280' }}>|</span>
        <span style={{ color: '#d1d5db' }}>{user?.username || 'admin'}</span>
        <button onClick={handleLogout} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', cursor: 'pointer', marginLeft: '0.5rem' }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
