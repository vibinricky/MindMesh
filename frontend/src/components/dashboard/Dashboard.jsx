import React from 'react';
import { useSelector } from 'react-redux';
import StatCards from './StatCards';
import RecentActivity from './RecentActivity';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  
  return (
    <div>
      <div className="dashboard-header">
        <h2>Platform Overview</h2>
        {user?.role === 'ROLE_RESEARCH_STRATEGIST' && (
          <button className="btn danger">
            Admin Actions
          </button>
        )}
      </div>
      <StatCards />
      <div className="mt-8">
        <h3>Recent Activity</h3>
        <div className="card mt-4">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
