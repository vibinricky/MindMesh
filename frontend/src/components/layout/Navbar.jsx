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
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', backgroundColor: '#333', color: '#fff' }}>
      <div style={{ fontWeight: 'bold', fontSize: '18px' }}>MindMesh</div>
      <div style={{ display: 'flex', gap: '15px' }}>
        <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/my-graphs" style={{ color: '#fff', textDecoration: 'none' }}>My Graphs</Link>
        <Link to="/discovery" style={{ color: '#fff', textDecoration: 'none' }}>Public Graphs</Link>
        <Link to="/search" style={{ color: '#fff', textDecoration: 'none' }}>Search</Link>
        <Link to="/metrics" style={{ color: '#fff', textDecoration: 'none' }}>Metrics</Link>
        <Link to="/profile" style={{ color: '#fff', textDecoration: 'none' }}>Profile</Link>
        <Link to="/activity" style={{ color: '#fff', textDecoration: 'none' }}>{user?.role === 'ROLE_RESEARCH_STRATEGIST' ? 'All Activity Logs' : 'My Activity'}</Link>
        <button onClick={handleLogout} style={{ background: 'transparent', color: '#fff', border: '1px solid #fff', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
