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
    <div className="card" style={{ maxWidth: 560, margin: '2rem auto' }}>
      <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>User Profile</h2>
      <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem', margin: 0 }}>
        <dt className="muted" style={{ fontWeight: 600 }}>Username</dt>
        <dd style={{ margin: 0, fontWeight: 500 }}>{user?.username}</dd>
        <dt className="muted" style={{ fontWeight: 600 }}>Role</dt>
        <dd style={{ margin: 0 }}>{user?.role?.replace('ROLE_', '').replaceAll('_', ' ')}</dd>
        <dt className="muted" style={{ fontWeight: 600 }}>Status</dt>
        <dd style={{ margin: 0 }}>{user?.status || 'ACTIVE'}</dd>
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
