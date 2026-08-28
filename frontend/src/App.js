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
    <div style={{ maxWidth: 560 }}>
      <h2>User Profile</h2>
      <dl>
        <dt>Username</dt><dd>{user?.username}</dd>
        <dt>Role</dt><dd>{user?.role?.replace('ROLE_', '').replaceAll('_', ' ')}</dd>
        <dt>Status</dt><dd>{user?.status || 'ACTIVE'}</dd>
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
      <div className="container" style={{ padding: '20px' }}>
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
