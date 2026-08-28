import React, { useEffect, useState } from 'react';
import * as graphService from '../../services/graphService';

const RecentActivity = () => {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    graphService.getActivity(0, 5).then(data => setActivity(data.content || [])).catch(console.error);
  }, []);

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {activity.length === 0 && <p>No recent activity found.</p>}
      {activity.map(log => (
        <li key={log.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
          <span style={{ fontSize: '12px', color: '#888', display: 'inline-block', width: '150px' }}>
            {new Date(log.timestamp).toLocaleString()}
          </span>
          <strong style={{ margin: '0 10px' }}>{log.action}</strong>
          <span>{log.details} <span className="muted">(Graph #{log.graphId ?? '—'})</span></span>
        </li>
      ))}
    </ul>
  );
};

export default RecentActivity;
