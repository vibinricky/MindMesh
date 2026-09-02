import React, { useEffect, useState } from 'react';
import * as graphService from '../../services/graphService';

const StatCards = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    graphService.getPlatformStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4rem', paddingBottom: '2rem', borderBottom: '1px solid #e2e8f0' }}>
      <div>
        <div style={{ color: '#3b82f6', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '0.05em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Total Knowledge Meshes</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e293b' }}>{stats.totalGraphs || stats.totalNodes || 0}</div>
      </div>
      <div>
        <div style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '0.05em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Public Intelligence</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e293b' }}>{stats.publicReach || 0}</div>
      </div>
      <div>
        <div style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '0.05em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Registered Architects</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e293b' }}>{stats.registeredUsers || 4}</div>
      </div>
    </div>
  );
};

export default StatCards;
