import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from './store/slices/authSlice';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/layout/Navbar';
import NotificationStack from './components/NotificationStack';

import Dashboard from './components/dashboard/Dashboard';
import GraphList from './components/graphs/GraphList';
import Discovery from './components/processes/Discovery';
import GraphCanvas from './components/canvas/GraphCanvas';
import SemanticSearch from './components/processes/SemanticSearch';
import GlobalMetrics from './components/processes/GlobalMetrics';
import ActivityLog from './components/processes/ActivityLog';

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  return (
    <div className="card" style={{ maxWidth: 580, margin: '2rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <span className="badge lime" style={{ marginBottom: '0.4rem' }}>[ ACCOUNT INFO ]</span>
          <h2 style={{ margin: 0 }}>User Profile</h2>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-color)' }}>
          ● ACTIVE
        </span>
      </div>
      <dl style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1.25rem', margin: 0, fontFamily: 'var(--font-main)', fontSize: '0.9rem' }}>
        <dt className="muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Username</dt>
        <dd style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.username}</dd>
        <dt className="muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Domain Role</dt>
        <dd style={{ margin: 0 }}>
          <span style={{
            background: 'var(--surface-color-elevated)',
            border: '1px solid var(--border-strong)',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-pill)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--accent-color)'
          }}>
            {user?.role?.replace('ROLE_', '').replaceAll('_', ' ') || 'ANALYST'}
          </span>
        </dd>
        <dt className="muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</dt>
        <dd style={{ margin: 0, color: 'var(--accent-color)', fontFamily: 'var(--font-mono)' }}>{user?.status || 'ACTIVE'}</dd>
      </dl>
    </div>
  );
};

const PrivateRoute = ({ children }) => {
  const { token, isLoading } = useSelector((state) => state.auth);
  if (isLoading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" />;
  return (
    <>
      <Navbar />
      <div className="container">
        {children}
      </div>
    </>
  );
};

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getProfile());
    }
  }, [dispatch, token]);

  return (
    <Router>
      <NotificationStack />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/my-graphs" element={<PrivateRoute><GraphList type="my" /></PrivateRoute>} />
        <Route path="/discovery" element={<PrivateRoute><Discovery /></PrivateRoute>} />
        <Route path="/graphs/:id/canvas" element={<PrivateRoute><GraphCanvas /></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute><SemanticSearch /></PrivateRoute>} />
        <Route path="/metrics" element={<PrivateRoute><GlobalMetrics /></PrivateRoute>} />
        <Route path="/activity" element={<PrivateRoute><ActivityLog /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
