import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteGraph } from '../../store/slices/graphSlice';
import * as graphService from '../../services/graphService';
import EmptyState from '../common/EmptyState';
import ErrorHandler from '../ErrorHandler';
import GraphForm from './GraphForm';

const GraphList = ({ type }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingGraph, setEditingGraph] = useState(null);

  const loadGraphs = (page = 0) => {
    setLoading(true);
    setError(null);
    graphService.getMyGraphs(page, 10)
      .then(data => {
        setItems(data.content || (Array.isArray(data) ? data : []));
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.number || page);
      })
      .catch(err => setError(err.response?.data?.message || 'Failed to fetch graphs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (type === 'my') {
      loadGraphs(0);
    }
  }, [type]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      loadGraphs(newPage);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this knowledge graph?')) {
      dispatch(deleteGraph(id)).then(() => loadGraphs(currentPage));
    }
  };

  const handleEdit = (graph) => {
    setEditingGraph(graph);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingGraph(null);
    loadGraphs(currentPage);
  };

  const isStrategist = user?.role === 'ROLE_RESEARCH_STRATEGIST' || user?.role === 'RESEARCH_STRATEGIST';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b' }}>My Knowledge Meshes</h2>
        {isStrategist && (
          <button onClick={() => setShowForm(true)} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '0.375rem', fontWeight: '500', cursor: 'pointer' }}>
            + Create New Mesh
          </button>
        )}
      </div>

      <ErrorHandler error={error ? { message: error } : null} onRetry={() => loadGraphs(currentPage)} />

      {loading && <p className="muted">Loading meshes...</p>}

      {!loading && items.length === 0 && !error && (
        <div className="card mt-4" style={{ textAlign: 'center', padding: '3rem' }}>
          <EmptyState 
            message="You haven't built any interactive graphs yet" 
            action={isStrategist && (
              <button onClick={() => setShowForm(true)} className="btn primary mt-4">
                Build First Mesh
              </button>
            )} 
          />
        </div>
      )}

      {!loading && items.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', padding: '1rem 0', borderBottom: '2px solid #e2e8f0', fontWeight: 'bold', color: '#475569' }}>
            <div>Title</div>
            <div>Complexity</div>
            <div>Visibility</div>
            <div>Actions</div>
          </div>
          <div>
            {items.map(graph => (
              <div key={graph.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', padding: '1rem 0', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>{graph.title}</div>
                <div style={{ color: '#64748b' }}>{(graph.complexityScore || 0).toFixed(1)}</div>
                <div style={{ color: '#64748b' }}>{graph.visibility || 'Public'}</div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <a href={`/graphs/${graph.id}/canvas`} style={{ textDecoration: 'none', padding: '0.35rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #3b82f6', color: '#3b82f6', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer' }}>Open Canvas</a>
                  {isStrategist && graph.ownerId === user?.id && (
                    <>
                      <button onClick={() => handleEdit(graph)} style={{ padding: '0.35rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #10b981', color: '#10b981', backgroundColor: 'transparent', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer' }}>Edit Info</button>
                      <button onClick={() => handleDelete(graph.id)} style={{ padding: '0.35rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #ef4444', color: '#ef4444', backgroundColor: 'transparent', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer' }}>Delete</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', marginTop: '2rem', padding: '1rem 0', color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>
              <button disabled={currentPage === 0} onClick={() => handlePageChange(currentPage - 1)} style={{ background: 'none', border: 'none', color: currentPage === 0 ? '#cbd5e1' : '#94a3b8', cursor: currentPage === 0 ? 'not-allowed' : 'pointer', fontWeight: '500' }}>Previous</button>
              <span>Page {currentPage + 1} of {totalPages}</span>
              <button disabled={currentPage === totalPages - 1} onClick={() => handlePageChange(currentPage + 1)} style={{ background: 'none', border: 'none', color: currentPage === totalPages - 1 ? '#cbd5e1' : '#1e293b', cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer', fontWeight: '500' }}>Next</button>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <GraphForm 
          graph={editingGraph} 
          onClose={closeForm} 
        />
      )}
    </div>
  );
};

export default GraphList;
