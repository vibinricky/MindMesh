import React from 'react';
import { useSelector } from 'react-redux';
import StatCards from './StatCards';
import RecentActivity from './RecentActivity';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      {/* EDITORIAL HEADER */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
          <span className="badge lime">[ OVERVIEW // DASHBOARD ]</span>
          <span className="badge">WORKSPACE ACTIVE</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            USER: {user?.username || 'user'}
          </span>
        </div>
        <h1 style={{ marginBottom: '0.5rem' }}>
          PLATFORM <span className="lime-accent">GOVERNANCE</span> & ANALYTICS
        </h1>
        <p className="muted" style={{ fontSize: '1rem', maxWidth: '640px', margin: 0 }}>
          Central overview for your MindMesh network graphs, knowledge assets, and real-time activity.
        </p>
      </div>

      {/* STAT CARDS */}
      <StatCards />

      {/* ACTIVITY SECTION */}
      <div style={{ marginTop: '3rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--accent-color)',
              borderRadius: '50%',
              display: 'inline-block',
              boxShadow: '0 0 8px var(--accent-color)'
            }} />
            <h3 style={{ margin: 0 }}>Recent Activity Logs</h3>
          </div>
          <span className="badge">[ LIVE AUDIT TRAIL ]</span>
        </div>
        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;
