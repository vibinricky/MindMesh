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
    <div className="container">
      {/* EDITORIAL HEADER */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span className="badge lime">[ DISCOVERY ]</span>
          <span className="badge">PUBLIC KNOWLEDGE BASE</span>
        </div>
        <h1 style={{ margin: '0 0 0.5rem 0' }}>
          KNOWLEDGE <span className="lime-accent">DISCOVERY</span>
        </h1>
        <p className="muted" style={{ margin: 0, maxWidth: '600px' }}>
          Explore published network graphs from the community and inspect complex knowledge domains.
        </p>
      </div>
      
      {loading && (
        <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          Loading public meshes...
        </div>
      )}

      {error && <ErrorHandler error={{ message: error }} />}

      {!loading && graphs.length === 0 && (
        <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <EmptyState message="No public knowledge graphs available at this time." />
        </div>
      )}

      {!loading && graphs.length > 0 && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {graphs.map(graph => (
              <MeshPreview key={graph.id} graph={graph} />
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
            marginTop: '3rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)'
          }}>
            <span style={{ color: 'var(--text-muted)', cursor: 'not-allowed' }}>← Previous</span>
            <span>Page 1 of 1 ({graphs.length} Total)</span>
            <span style={{ color: 'var(--text-primary)', cursor: 'pointer' }}>Next →</span>
          </div>
        </>
      )}

      {/* TRENDING TOPICS */}
      <div style={{ marginTop: '4rem', borderTop: '1px solid var(--border-color)', paddingTop: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <span className="badge">[ TOPIC DIRECTORY ]</span>
          <h3 style={{ margin: 0 }}>Trending Domains</h3>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {['#NEUROSCIENCE', '#AI_MODELS', '#PHYSICS', '#ECONOMICS', '#BIOINFORMATICS', '#LINGUISTICS', '#LOGIC'].map(tag => (
            <span
              key={tag}
              style={{
                backgroundColor: 'var(--surface-color)',
                color: 'var(--text-primary)',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: '600',
                border: '1px solid var(--border-strong)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-color)';
                e.currentTarget.style.color = 'var(--accent-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-strong)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discovery;
