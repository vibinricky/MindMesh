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
    <div>
      <h2 style={{ marginBottom: '20px' }}>Public Discovery</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Explore knowledge meshes published by the community.</p>
      
      {loading && <p>Loading public meshes...</p>}
      {error && <ErrorHandler error={{ message: error }} />}
      {!loading && graphs.length === 0 && <EmptyState message="No public meshes available." />}
      {!loading && graphs.length > 0 && (
        <div>
          {graphs.map(graph => (
            <MeshPreview key={graph.id} graph={graph} showActions={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Discovery;
