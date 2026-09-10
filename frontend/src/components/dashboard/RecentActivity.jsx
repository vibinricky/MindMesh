import React, { useEffect, useState } from 'react';
import * as graphService from '../../services/graphService';

const RecentActivity = () => {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    graphService.getActivity(0, 5).then(data => setActivity(data.content || [])).catch(console.error);
  }, []);

  return (
    <div style={{
      background: 'var(--surface-color)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }}>
      {/* TABLE HEADER */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 1.8fr 1fr',
        padding: '0.85rem 1.5rem',
        background: '#0b0d12',
        borderBottom: '1px solid var(--border-color)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.725rem',
        fontWeight: '700',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em'
      }}>
        <div>Event Timestamp</div>
        <div>Action</div>
        <div>Activity Details</div>
        <div>Status</div>
      </div>

      {/* TABLE BODY */}
      <div style={{ minHeight: '220px' }}>
        {activity.length === 0 && (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
            No recent activity logs recorded.
          </div>
        )}
        {activity.map((log) => (
          <div
            key={log.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 1fr 1.8fr 1fr',
              padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              alignItems: 'center',
              fontSize: '0.875rem',
              transition: 'background-color 0.15s ease'
            }}
          >
            <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              {new Date(log.timestamp).toLocaleString()}
            </div>
            <div>
              <span style={{
                display: 'inline-block',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: '700',
                letterSpacing: '0.05em',
                backgroundColor: log.action === 'CREATE' ? 'var(--accent-dim)' : 'var(--surface-color-elevated)',
                color: log.action === 'CREATE' ? 'var(--accent-color)' : 'var(--text-primary)',
                border: log.action === 'CREATE' ? '1px solid var(--accent-border)' : '1px solid var(--border-strong)',
                textTransform: 'uppercase'
              }}>
                {log.action}
              </span>
            </div>
            <div style={{ fontWeight: '500', color: 'var(--text-primary)', wordBreak: 'break-word' }}>
              {log.details || '—'}
            </div>
            <div style={{
              color: 'var(--accent-color)',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                backgroundColor: 'var(--accent-color)',
                borderRadius: '50%',
                display: 'inline-block'
              }} />
              VERIFIED
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.85rem 1.5rem',
        borderTop: '1px solid var(--border-color)',
        background: '#0b0d12',
        color: 'var(--text-secondary)',
        fontSize: '0.8rem',
        fontFamily: 'var(--font-mono)'
      }}>
        <span>SHOWING RECENT ACTIONS</span>
        <span>REAL-TIME AUDIT</span>
      </div>
    </div>
  );
};

export default RecentActivity;
