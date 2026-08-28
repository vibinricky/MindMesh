import React from 'react';
import StatCards from './StatCards';
import RecentActivity from './RecentActivity';

const Dashboard = () => {
  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Platform Overview</h2>
      <StatCards />
      <div style={{ marginTop: '30px' }}>
        <h3>Recent Activity</h3>
        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;
