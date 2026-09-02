import React, { useEffect, useState } from 'react';
import * as graphService from '../../services/graphService';
import MeshPreview from '../canvas/MeshPreview';
import EmptyState from '../common/EmptyState';
import ErrorHandler from '../ErrorHandler';

const Discovery = () => {
  const [graphs, setGraphs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    graphService.getPublicGraphs()
      .then(data => setGraphs(Array.isArray(data) ? data : (data.content || [])))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load public meshes.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Knowledge Discovery</h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>Explore public meshes and find inspiration for your own work.</p>
      </div>
      
      {loading && <p>Loading public meshes...</p>}
      {error && <ErrorHandler error={{ message: error }} />}
      {!loading && graphs.length === 0 && <EmptyState message="No public meshes available." />}
      {!loading && graphs.length > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {graphs.map(graph => (
              <MeshPreview key={graph.id} graph={graph} showActions={false} />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', marginTop: '3rem', color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>
            <span style={{ color: '#cbd5e1', cursor: 'not-allowed' }}>Previous</span>
            <span>Page 1 of 1 ({graphs.length} Total)</span>
            <span style={{ color: '#1e293b', cursor: 'pointer' }}>Next</span>
          </div>
        </>
      )}

      <div style={{ marginTop: '4rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.25rem' }}>Trending Topics</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {['#PHYSICS', '#HISTORY', '#ETHICS', '#BIOLOGY', '#LINGUISTICS'].map(tag => (
            <span key={tag} style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.5rem 1rem', borderRadius: '1.5rem', fontSize: '0.875rem', fontWeight: '600', border: '1px solid #bfdbfe' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discovery;
