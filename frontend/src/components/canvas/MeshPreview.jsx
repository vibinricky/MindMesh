import React from 'react';
import { Link } from 'react-router-dom';

const MeshPreview = ({ graph, onEdit, onDelete, showActions }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '0.5rem' }}>{graph.title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', flex: 1, marginBottom: '1rem' }}>{graph.description || 'No description provided'}</p>
      
      <div className="flex-row gap-4 muted" style={{ marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <span>Domain: {graph.domain || 'N/A'}</span>
        <span>•</span>
        <span>{graph.isPublic ? 'Public' : 'Private'}</span>
        <span>•</span>
        <span>Complexity: {graph.complexityScore}</span>
      </div>
      
      <div className="flex-row gap-2 mt-auto">
        <Link to={`/graphs/${graph.id}/canvas`} className="btn primary" style={{ flex: 1 }}>
          Open Canvas
        </Link>
        {showActions && onEdit && (
          <button onClick={() => onEdit(graph)}>Edit</button>
        )}
        {showActions && onDelete && (
          <button onClick={() => onDelete(graph.id)} className="danger">Delete</button>
        )}
      </div>
    </div>
  );
};

export default MeshPreview;
