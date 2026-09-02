import React, { useEffect, useState } from 'react';
import * as graphService from '../../services/graphService';

const RecentActivity = () => {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    graphService.getActivity(0, 5).then(data => setActivity(data.content || [])).catch(console.error);
  }, []);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr 1fr', padding: '1rem 0', borderBottom: '2px solid #e2e8f0', fontWeight: 'bold', color: '#475569' }}>
        <div>Event Timestamp</div>
        <div>Action Node</div>
        <div>Target Intelligence</div>
        <div>Governance Status</div>
      </div>
      <div style={{ minHeight: '300px' }}>
        {activity.length === 0 && <p style={{ padding: '2rem 0', color: '#64748b' }}>No recent governance logs.</p>}
        {activity.map(log => (
          <div key={log.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr 1fr', padding: '1rem 0', borderBottom: '1px solid #f1f5f9', alignItems: 'center', fontSize: '0.9rem' }}>
            <div style={{ color: '#64748b' }}>{new Date(log.timestamp).toLocaleString()}</div>
            <div>
              <span style={{ 
                padding: '0.25rem 0.75rem', 
                borderRadius: '9999px', 
                fontSize: '0.75rem', 
                fontWeight: 'bold', 
                backgroundColor: log.action === 'CREATE' ? '#dcfce7' : '#e0e7ff',
                color: log.action === 'CREATE' ? '#166534' : '#3730a3',
                textTransform: 'uppercase'
              }}>
                {log.action}
              </span>
            </div>
            <div style={{ fontWeight: '500', color: '#1e293b' }}>{log.details || '—'}</div>
            <div style={{ color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
              VERIFIED
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', marginTop: '2rem', padding: '1rem 0', color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>
        <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontWeight: '500' }}>Previous Control</button>
        <span>Cycle 1 of 2</span>
        <button style={{ background: 'none', border: 'none', color: '#1e293b', cursor: 'pointer', fontWeight: '500' }}>Next Control</button>
      </div>
    </div>
  );
};

export default RecentActivity;
