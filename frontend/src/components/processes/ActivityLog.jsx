import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as graphService from '../../services/graphService';
import ErrorHandler from '../ErrorHandler';

const ActivityLog = () => {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const isStrategist = user?.role === 'ROLE_RESEARCH_STRATEGIST' || user?.role === 'RESEARCH_STRATEGIST';

  useEffect(() => {
    (isStrategist ? graphService.getAllActivity() : graphService.getActivity())
      .then(data => setActivity(data.content || (Array.isArray(data) ? data : [])))
      .catch(err => setError(err.response?.data?.message || 'Failed to load logs'))
      .finally(() => setLoading(false));
  }, [user?.role, isStrategist]);

  return (
    <div className="container">
      {/* EDITORIAL HEADER */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span className="badge lime">[ AUDIT LOG ]</span>
          <span className="badge">GOVERNANCE HISTORY</span>
        </div>
        <h1 style={{ margin: '0 0 0.5rem 0' }}>
          {isStrategist ? 'PLATFORM' : 'MY'} <span className="lime-accent">ACTIVITY LOGS</span>
        </h1>
        <p className="muted" style={{ margin: 0, maxWidth: '600px' }}>
          Comprehensive operational record of graph modifications, node additions, and collaborative events.
        </p>
      </div>

      {loading && (
        <div style={{ padding: '3rem 0', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
          Loading activity logs...
        </div>
      )}

      {error && <ErrorHandler error={{ message: error }} />}

      {!loading && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Graph Ref</th>
                <th>Action</th>
                <th>Activity Details</th>
              </tr>
            </thead>
            <tbody>
              {activity.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                      {log.username || 'System User'}
                    </span>{' '}
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      #{log.userId ?? '—'}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-color)', fontSize: '0.8rem' }}>
                    #{log.graphId ?? '—'}
                  </td>
                  <td>
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
                  </td>
                  <td style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                    {log.details || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {activity.length === 0 && (
            <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              No activity logs recorded.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
