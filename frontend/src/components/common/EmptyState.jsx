import React from 'react';

const EmptyState = ({ message, action }) => {
  return (
    <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '8px' }}>
      <p style={{ color: '#666', fontSize: '18px' }}>{message}</p>
      {action && <div style={{ marginTop: '20px' }}>{action}</div>}
    </div>
  );
};

export default EmptyState;
