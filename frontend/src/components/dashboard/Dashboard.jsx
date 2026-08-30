import React from 'react';
import { useSelector } from 'react-redux';
import StatCards from './StatCards';
import RecentActivity from './RecentActivity';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Platform Overview</h2>
        {user?.role === 'ROLE_RESEARCH_STRATEGIST' && (
          <button style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
            Admin Actions
          </button>
        )}
      </div>
      <StatCards />
      <div style={{ marginTop: '30px' }}>
        <h3>Recent Activity</h3>
        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;
