import React from 'react';

const EmptyState = ({ message, action, domain, ctaText, onAction }) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '3rem 2rem',
      background: 'var(--surface-color)',
      border: '1px dashed var(--border-strong)',
      borderRadius: 'var(--radius-lg)'
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        color: 'var(--accent-color)',
        marginBottom: '0.5rem',
        letterSpacing: '0.08em'
      }}>
        [ NO DATA FOUND ]
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: '0 0 1rem 0' }}>
        {message}
      </p>
      {action && <div style={{ marginTop: '1.25rem' }}>{action}</div>}
      {onAction && (
        <button
          onClick={onAction}
          className="btn primary"
          style={{ marginTop: '1.25rem' }}
        >
          <span>
            {ctaText ? (domain ? ctaText.replace('mesh', `${domain} mesh`) : ctaText) : (domain ? `Create your first ${domain} mesh` : 'Create your first mesh')}
          </span>
          <span>↗</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
