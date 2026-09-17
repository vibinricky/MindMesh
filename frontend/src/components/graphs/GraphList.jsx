import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteGraph } from '../../store/slices/graphSlice';
import graphService from '../../services/graphService';
import EmptyState from '../common/EmptyState';
import ErrorHandler from '../ErrorHandler';
import GraphForm from './GraphForm';
import GenerateGraphModal from './GenerateGraphModal';

const GraphList = ({ type = 'my' }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
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

  const isStrategist = user?.role === 'ROLE_RESEARCH_STRATEGIST' || user?.role === 'RESEARCH_STRATEGIST' || user?.role?.includes('ADMIN');

  return (
    <div className="container">
      {/* PAGE HEADER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className="badge lime">[ WORKSPACE ]</span>
            <span className="badge">GRAPHS & CANVAS</span>
          </div>
          <h1 style={{ margin: 0 }}>
            MY KNOWLEDGE <span className="lime-accent">MESHES</span>
          </h1>
          <p className="muted" style={{ margin: '0.5rem 0 0 0' }}>
            Interactive graphs created and curated in your workspace.
          </p>
        </div>

        {isStrategist && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowGenerateModal(true)}
              style={{
                background: 'linear-gradient(135deg, rgba(220, 255, 2, 0.12), rgba(16, 185, 129, 0.12))',
                border: '1px solid var(--accent-color)',
                color: 'var(--accent-color)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer'
              }}
            >
              <span>✨ Generate Graph with AI</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="btn primary"
            >
              <span>+ Create New Mesh</span>
              <span>↗</span>
            </button>
          </div>
        )}
      </div>

      <ErrorHandler error={error ? { message: error } : null} onRetry={() => loadGraphs(currentPage)} />

      {loading && (
        <div style={{ padding: '3rem 0', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
          Loading knowledge meshes...
        </div>
      )}

      {!loading && items.length === 0 && !error && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <EmptyState 
            message="You haven't built any interactive graphs yet" 
            action={isStrategist && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setShowGenerateModal(true)}
                  style={{
                    background: 'linear-gradient(135deg, rgba(220, 255, 2, 0.12), rgba(16, 185, 129, 0.12))',
                    border: '1px solid var(--accent-color)',
                    color: 'var(--accent-color)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer'
                  }}
                >
                  <span>✨ Generate Graph with AI</span>
                </button>
                <button onClick={() => setShowForm(true)} className="btn primary">
                  <span>Build First Mesh</span>
                  <span>↗</span>
                </button>
              </div>
            )} 
          />
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title & Domain</th>
                <th>Complexity Score</th>
                <th>Visibility</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(graph => (
                <tr key={graph.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      {graph.title}
                    </div>
                    {graph.domain && (
                      <span className="badge" style={{ marginTop: '0.35rem', fontSize: '0.65rem' }}>
                        {graph.domain}
                      </span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-color)' }}>
                      {(graph.complexityScore || 0).toFixed(1)}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)',
                      border: '1px solid var(--border-strong)',
                      backgroundColor: 'var(--surface-color-elevated)',
                      color: 'var(--text-secondary)'
                    }}>
                      {graph.isPublic ? 'PUBLIC' : (graph.visibility || 'PRIVATE')}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <Link
                        to={`/graphs/${graph.id}/canvas`}
                        style={{
                          textDecoration: 'none',
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--accent-color)',
                          color: 'var(--accent-color)',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-display)',
                          fontWeight: '700',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <span>Open Canvas</span>
                        <span>↗</span>
                      </Link>
                      {isStrategist && (graph.ownerId === user?.id || String(graph.ownerId) === String(user?.id)) && (
                        <>
                          <button
                            onClick={() => handleEdit(graph)}
                            style={{
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.75rem',
                              background: 'transparent',
                              borderColor: 'var(--border-strong)',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(graph.id)}
                            className="btn danger"
                            style={{
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.75rem'
                            }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2rem',
              padding: '1.25rem',
              borderTop: '1px solid var(--border-color)',
              background: '#0b0d12',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)'
            }}>
              <button
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
                style={{ background: 'none', border: 'none', cursor: currentPage === 0 ? 'not-allowed' : 'pointer' }}
              >
                ← Previous
              </button>
              <span>Page {currentPage + 1} of {totalPages}</span>
              <button
                disabled={currentPage === totalPages - 1}
                onClick={() => handlePageChange(currentPage + 1)}
                style={{ background: 'none', border: 'none', cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer' }}
              >
                Next →
              </button>
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

      {showGenerateModal && (
        <GenerateGraphModal
          onClose={() => setShowGenerateModal(false)}
          onGenerated={() => loadGraphs(0)}
        />
      )}
    </div>
  );
};

export default GraphList;
