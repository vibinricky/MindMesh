import React from 'react';

const CapacityBar = ({ score }) => {
  const percentage = Math.min(Math.max(score, 0), 100);
  let color = '#28a745';
  if (percentage > 50) color = '#ffc107';
  if (percentage > 80) color = '#dc3545';

  return (
    <div style={{ marginBottom: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
        <span>Complexity Score</span>
        <span>{score?.toFixed(2) || '0.00'}</span>
      </div>
      <div style={{ height: '8px', background: '#e9ecef', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${percentage}%`, backgroundColor: color, transition: 'width 0.3s' }} />
      </div>
    </div>
  );
};

export default CapacityBar;
