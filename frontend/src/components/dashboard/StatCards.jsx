import React, { useEffect, useState } from 'react';
import * as graphService from '../../services/graphService';

const StatCards = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    graphService.getPlatformStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div className="stat-grid">
      <div className="card stat-card">
        <div className="stat-title">Total Nodes</div>
        <div className="stat-value">{stats.totalNodes || 0}</div>
      </div>
      <div className="card stat-card">
        <div className="stat-title">Average Complexity</div>
        <div className="stat-value">{stats.averageComplexity?.toFixed(2) || '0.00'}</div>
      </div>
      <div className="card stat-card">
        <div className="stat-title">Network Density</div>
        <div className="stat-value">{stats.networkDensity?.toFixed(2) || '0.00'}</div>
      </div>
      <div className="card stat-card">
        <div className="stat-title">Public Reach</div>
        <div className="stat-value">{stats.publicReach || 0}</div>
      </div>
    </div>
  );
};

export default StatCards;
