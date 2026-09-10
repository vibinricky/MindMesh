import React from 'react';

const ErrorHandler = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <div style={{
      padding: '0.85rem 1.25rem',
      backgroundColor: 'var(--danger-bg)',
      color: '#ff8a98',
      border: '1px solid var(--danger-color)',
      marginBottom: '1.25rem',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-main)',
      fontSize: '0.875rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: '0.725rem',
          letterSpacing: '0.05em',
          color: 'var(--danger-color)'
        }}>
          [!] SYSTEM NOTICE
        </span>
      </div>
      <p style={{ margin: 0 }}>{error.message || 'An unexpected error occurred in MindMesh'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: '0.75rem',
            padding: '0.35rem 0.85rem',
            background: 'transparent',
            color: 'var(--text-primary)',
            border: '1px solid var(--danger-color)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          Retry Action ↗
        </button>
      )}
    </div>
  );
};

export default ErrorHandler;
