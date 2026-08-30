import React from 'react';

const EmptyState = ({ message, action, domain, ctaText, onAction }) => {
  return (
    <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '8px' }}>
      <p style={{ color: '#666', fontSize: '18px' }}>{message}</p>
      {action && <div style={{ marginTop: '20px' }}>{action}</div>}
      {onAction && (
        <button onClick={onAction} style={{ marginTop: '20px', padding: '8px 16px', cursor: 'pointer' }}>
          {ctaText ? (domain ? ctaText.replace('mesh', `${domain} mesh`) : ctaText) : (domain ? `Create your first ${domain} mesh` : 'Create your first mesh')}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
