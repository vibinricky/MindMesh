import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isStrategist = user?.role === 'ROLE_RESEARCH_STRATEGIST' || user?.role === 'RESEARCH_STRATEGIST';

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      backgroundColor: 'rgba(11, 13, 17, 0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.85rem 2.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      {/* BRAND & PRIMARY LINKS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            width: '26px',
            height: '26px',
            backgroundColor: 'var(--accent-color)',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            fontFamily: 'var(--font-display)',
            fontSize: '0.9rem',
            borderRadius: '4px',
            clipPath: 'polygon(0 0, 100% 0, 100% 75%, 75% 100%, 0 100%)'
          }}>
            M
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.2rem',
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)'
          }}>
            MINDMESH
          </span>
        </Link>

        {/* NAVIGATION LINKS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontFamily: 'var(--font-main)' }}>
          <Link
            to="/dashboard"
            style={{
              color: isActive('/dashboard') ? 'var(--accent-color)' : 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              borderBottom: isActive('/dashboard') ? '2px solid var(--accent-color)' : '2px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            Dashboard
          </Link>

          {isStrategist ? (
            <>
              <Link
                to="/my-graphs"
                style={{
                  color: isActive('/my-graphs') ? 'var(--accent-color)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  borderBottom: isActive('/my-graphs') ? '2px solid var(--accent-color)' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                Workspace
              </Link>
              <Link
                to="/search"
                style={{
                  color: isActive('/search') ? 'var(--accent-color)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  borderBottom: isActive('/search') ? '2px solid var(--accent-color)' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                Semantic Search
              </Link>
              <Link
                to="/discovery"
                style={{
                  color: isActive('/discovery') ? 'var(--accent-color)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  borderBottom: isActive('/discovery') ? '2px solid var(--accent-color)' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                Discovery
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/discovery"
                style={{
                  color: isActive('/discovery') ? 'var(--accent-color)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  borderBottom: isActive('/discovery') ? '2px solid var(--accent-color)' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                Discovery
              </Link>
              <Link
                to="/activity"
                style={{
                  color: isActive('/activity') ? 'var(--accent-color)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  borderBottom: isActive('/activity') ? '2px solid var(--accent-color)' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                Activity Logs
              </Link>
              <Link
                to="/metrics"
                style={{
                  color: isActive('/metrics') ? 'var(--accent-color)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  borderBottom: isActive('/metrics') ? '2px solid var(--accent-color)' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                Global Metrics
              </Link>
            </>
          )}
        </div>
      </div>

      {/* RIGHT USER / LOGOUT AREA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem' }}>
        <Link
          to="/profile"
          style={{
            fontFamily: 'var(--font-mono)',
            border: '1px solid var(--border-strong)',
            backgroundColor: 'var(--surface-color)',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-pill)',
            color: 'var(--accent-color)',
            fontWeight: '600',
            letterSpacing: '0.05em',
            fontSize: '0.725rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span>{user?.role ? user.role.replace('ROLE_', '').replace('_', ' ') : 'RESEARCHER'}</span>
        </Link>
        <span style={{ color: 'var(--border-strong)' }}>|</span>
        <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
          {user?.username || 'user'}
        </span>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: 'transparent',
            color: 'var(--danger-color)',
            border: '1px solid rgba(255, 51, 75, 0.4)',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
