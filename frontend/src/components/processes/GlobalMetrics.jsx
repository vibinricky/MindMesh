import React from 'react';
import StatCards from '../dashboard/StatCards';

const GlobalMetrics = () => {
  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Global Metrics</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Detailed platform-wide analytics and performance indicators.</p>
      <StatCards />
    </div>
  );
};

export default GlobalMetrics;
