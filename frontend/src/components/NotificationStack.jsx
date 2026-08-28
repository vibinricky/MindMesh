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
  return <div style={{ position: 'fixed', right: 16, top: 16, zIndex: 100 }}>
    {invites.map((invite) => <div key={invite.id} style={{ background: '#fff', border: '1px solid #93c5fd', borderRadius: 8, padding: 12, marginBottom: 8, boxShadow: '0 4px 12px #0002' }}>
      <strong>{invite.inviterUsername}</strong> invited you to collaborate on <strong>{invite.graphTitle}</strong>.
      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}><button onClick={() => respond(invite.id, true)}>Accept</button><button onClick={() => respond(invite.id, false)}>Decline</button></div>
    </div>)}
  </div>;
};

export default NotificationStack;
