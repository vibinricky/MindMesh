import React, { useEffect, useState } from 'react';
import * as graphService from '../../services/graphService';

const RecentActivity = () => {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    graphService.getActivity(0, 5).then(data => setActivity(data.content || [])).catch(console.error);
  }, []);

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {activity.length === 0 && <p className="muted">No recent activity found.</p>}
      {activity.map(log => (
        <li key={log.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span className="muted" style={{ minWidth: '150px' }}>
            {new Date(log.timestamp).toLocaleString()}
          </span>
          <strong>{log.action}</strong>
          <span style={{ color: 'var(--text-secondary)' }}>{log.details} <span className="muted">(Graph #{log.graphId ?? '—'})</span></span>
        </li>
      ))}
    </ul>
  );
};

export default RecentActivity;
