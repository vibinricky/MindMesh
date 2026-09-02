import React, { useEffect, useState } from 'react';
import * as graphService from '../../services/graphService';
import ErrorHandler from '../ErrorHandler';
import { useSelector } from 'react-redux';

const ActivityLog = () => {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const isStrategist = user?.role === 'ROLE_RESEARCH_STRATEGIST' || user?.role === 'RESEARCH_STRATEGIST';

  useEffect(() => {
    (isStrategist ? graphService.getAllActivity() : graphService.getActivity())
      .then(data => setActivity(data.content || []))
      .catch(err => setError(err.response?.data?.message || 'Failed to load logs'))
      .finally(() => setLoading(false));
  }, [user?.role]);

  if (loading) return <p>Loading activity logs...</p>;
  if (error) return <ErrorHandler error={{ message: error }} />;

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>{isStrategist ? 'Platform Activity Logs' : 'My Activity Logs'}</h2>
      <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '12px 15px', borderBottom: '1px solid #ddd' }}>Timestamp</th>
              <th style={{ padding: '12px 15px', borderBottom: '1px solid #ddd' }}>User ID</th>
              <th style={{ padding: '12px 15px', borderBottom: '1px solid #ddd' }}>Graph ID</th>
              <th style={{ padding: '12px 15px', borderBottom: '1px solid #ddd' }}>Action</th>
              <th style={{ padding: '12px 15px', borderBottom: '1px solid #ddd' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {activity.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 15px' }}>{new Date(log.timestamp).toLocaleString()}</td>
                <td style={{ padding: '12px 15px' }}>{log.username || 'Unknown user'} <span className="muted">#{log.userId ?? '—'}</span></td>
                <td style={{ padding: '12px 15px' }}>#{log.graphId ?? '—'}</td>
                <td style={{ padding: '12px 15px' }}><strong>{log.action}</strong></td>
                <td style={{ padding: '12px 15px' }}>{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {activity.length === 0 && <p style={{ padding: '20px', textAlign: 'center' }}>No activity logs found.</p>}
      </div>
    </div>
  );
};

export default ActivityLog;
