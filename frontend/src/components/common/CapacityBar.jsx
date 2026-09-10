import React from 'react';

const CapacityBar = ({ score }) => {
  const percentage = Math.min(Math.max(score, 0), 100);
  let color = 'var(--accent-color)';
  if (percentage > 60) color = 'var(--warning-color)';
  if (percentage > 85) color = 'var(--danger-color)';

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.725rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'var(--text-secondary)',
        marginBottom: '0.35rem'
      }}>
        <span>Complexity Rating</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>
          {score?.toFixed(2) || '0.00'}%
        </span>
      </div>
      <div style={{
        height: '6px',
        background: 'var(--surface-color-elevated)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-pill)',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          backgroundColor: color,
          boxShadow: percentage <= 60 ? '0 0 6px var(--accent-color)' : 'none',
          transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }} />
      </div>
    </div>
  );
};

export default CapacityBar;
