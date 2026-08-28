import React, { useEffect, useState } from 'react';
import * as graphService from '../../services/graphService';

const StatCards = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    graphService.getPlatformStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  const cardStyle = {
    background: '#fff', border: '1px solid #ddd', padding: '20px', 
    borderRadius: '8px', flex: '1', minWidth: '150px', textAlign: 'center'
  };

  return (
    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
      <div style={cardStyle}>
        <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Total Nodes</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalNodes || 0}</div>
      </div>
      <div style={cardStyle}>
        <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Average Complexity</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.averageComplexity?.toFixed(2) || '0.00'}</div>
      </div>
      <div style={cardStyle}>
        <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Network Density</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.networkDensity?.toFixed(2) || '0.00'}</div>
      </div>
      <div style={cardStyle}>
        <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Public Reach</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.publicReach || 0}</div>
      </div>
    </div>
  );
};

export default StatCards;
