import React from 'react';
import { Link } from 'react-router-dom';

const MeshPreview = ({ graph }) => {
  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '260px',
      position: 'relative'
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span className="badge lime" style={{ fontSize: '0.65rem' }}>
            PUBLIC MESH
          </span>
          {graph.domain && (
            <span className="badge" style={{ fontSize: '0.65rem' }}>
              {graph.domain}
            </span>
          )}
        </div>

        <h3 style={{ margin: '0 0 0.5rem 0', wordBreak: 'break-word' }}>
          {graph.title}
        </h3>

        <p className="muted" style={{
          fontSize: '0.875rem',
          margin: '0 0 1.25rem 0',
          lineHeight: 1.5,
          wordBreak: 'break-word',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {graph.description || 'No description provided for this knowledge graph.'}
        </p>
      </div>

      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.75rem',
          marginBottom: '1rem'
        }}>
          <span>COMPLEXITY: <strong style={{ color: 'var(--accent-color)' }}>{(graph.complexityScore || 0).toFixed(1)}</strong></span>
          <span>BY: <strong style={{ color: 'var(--text-primary)' }}>{graph.ownerUsername || 'admin'}</strong></span>
        </div>

        <Link
          to={`/graphs/${graph.id}/canvas`}
          className="btn primary"
          style={{ width: '100%', boxSizing: 'border-box' }}
        >
          <span>View Canvas</span>
          <span>↗</span>
        </Link>
      </div>
    </div>
  );
};

export default MeshPreview;
