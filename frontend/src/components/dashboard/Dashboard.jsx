import React from 'react';
import { useSelector } from 'react-redux';
import StatCards from './StatCards';
import RecentActivity from './RecentActivity';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  
  return (
    <div style={{ padding: '2rem 4rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Platform Governance & Orchestration</h2>
        <p style={{ color: '#475569', fontSize: '0.95rem' }}>Master control center for MindMesh knowledge architecture and global intelligence flow.</p>
      </div>
      <StatCards />
      <div style={{ marginTop: '4rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
          Real-Time Governance Logs
        </h3>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
