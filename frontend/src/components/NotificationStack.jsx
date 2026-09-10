import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getPendingInvites, respondToInvite } from '../services/graphService';

const NotificationStack = () => {
  const { token } = useSelector((state) => state.auth);
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    if (!token) { setInvites([]); return undefined; }
    const refresh = () => getPendingInvites().then(setInvites).catch(() => {});
    refresh();
    const interval = window.setInterval(refresh, 30000);
    return () => window.clearInterval(interval);
  }, [token]);

  const respond = async (inviteId, accepted) => {
    await respondToInvite(inviteId, accepted);
    setInvites((current) => current.filter((invite) => invite.id !== inviteId));
  };

  if (!invites.length) return null;

  return (
    <div style={{ position: 'fixed', right: 24, top: 75, zIndex: 1000, maxWidth: 360, width: '100%' }}>
      {invites.map((invite) => (
        <div
          key={invite.id}
          style={{
            background: 'var(--surface-color)',
            border: '1px solid var(--accent-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '0.75rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--accent-color)',
              background: 'var(--accent-dim)',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 700,
              letterSpacing: '0.05em'
            }}>
              COLLABORATION INVITE
            </span>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
            <span style={{ fontWeight: '700', color: 'var(--accent-color)' }}>{invite.inviterUsername}</span> invited you to collaborate on{' '}
            <span style={{ fontWeight: '700' }}>{invite.graphTitle}</span>.
          </div>
          <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => respond(invite.id, true)}
              className="btn primary"
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
            >
              Accept ↗
            </button>
            <button
              onClick={() => respond(invite.id, false)}
              style={{
                padding: '0.35rem 0.85rem',
                fontSize: '0.75rem',
                background: 'transparent',
                borderColor: 'var(--border-strong)'
              }}
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationStack;
