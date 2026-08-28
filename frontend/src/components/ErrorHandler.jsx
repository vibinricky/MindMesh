import React from 'react';

const ErrorHandler = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #f87171', marginBottom: '15px', borderRadius: '4px' }}>
      <p style={{ margin: 0 }}>{error.message || 'An unexpected error occurred in MindMesh'}</p>
      {onRetry && (
        <button onClick={onRetry} style={{ marginTop: '10px', padding: '5px 10px' }}>
          Retry Action
        </button>
      )}
    </div>
  );
};

export default ErrorHandler;
