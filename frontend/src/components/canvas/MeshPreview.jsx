import React from 'react';
import { Link } from 'react-router-dom';

const MeshPreview = ({ graph, onEdit, onDelete, showActions }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
      <h3>{graph.title}</h3>
      <p style={{ color: '#666', fontSize: '14px' }}>{graph.description || 'No description provided'}</p>
      <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#888', marginBottom: '15px' }}>
        <span>Domain: {graph.domain || 'N/A'}</span>
        <span>Visibility: {graph.isPublic ? 'Public' : 'Private'}</span>
        <span>Complexity: {graph.complexityScore}</span>
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link to={`/graphs/${graph.id}/canvas`} style={{ padding: '5px 10px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Open Canvas
        </Link>
        {showActions && onEdit && (
          <button onClick={() => onEdit(graph)} style={{ padding: '5px 10px', cursor: 'pointer' }}>Edit</button>
        )}
        {showActions && onDelete && (
          <button onClick={() => onDelete(graph.id)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', cursor: 'pointer', border: 'none' }}>Delete</button>
        )}
      </div>
    </div>
  );
};

export default MeshPreview;
