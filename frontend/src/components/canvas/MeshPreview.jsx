import React from 'react';
import { Link } from 'react-router-dom';

const MeshPreview = ({ graph, onEdit, onDelete, showActions }) => {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ backgroundColor: '#2563eb', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderRadius: '1rem', alignSelf: 'flex-start', marginBottom: '1rem', textTransform: 'uppercase' }}>
        Public Mesh
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem', marginTop: 0 }}>{graph.title}</h3>
      <p style={{ color: '#64748b', fontSize: '0.875rem', flex: 1, marginBottom: '1.5rem', marginTop: '0.5rem', wordBreak: 'break-word' }}>{graph.description || 'No description provided'}</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        <span>Complexity: {(graph.complexityScore || 0).toFixed(1)}</span>
        <span>Owner: {graph.ownerUsername || 'admin'}</span>
      </div>
      
      <Link to={`/graphs/${graph.id}/canvas`} style={{ display: 'block', textAlign: 'center', backgroundColor: '#2563eb', color: 'white', textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '0.375rem', fontWeight: '500', width: '100%', boxSizing: 'border-box' }}>
        View Canvas
      </Link>
    </div>
  );
};

export default MeshPreview;
