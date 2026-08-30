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
    <nav className="navbar">
      <div className="navbar-brand">MindMesh</div>
      <div className="navbar-links">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/my-graphs" className="nav-link">My Graphs</Link>
        <Link to="/discovery" className="nav-link">Public Graphs</Link>
        <Link to="/search" className="nav-link">Search</Link>
        <Link to="/metrics" className="nav-link">Metrics</Link>
        <Link to="/profile" className="nav-link">Profile</Link>
        <Link to="/activity" className="nav-link">{user?.role === 'ROLE_RESEARCH_STRATEGIST' ? 'All Activity Logs' : 'My Activity'}</Link>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
